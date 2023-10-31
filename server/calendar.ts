const ICAL = require('ical.js');
const CryptoJS = require("crypto-js");
const fs = require("fs");
let comp = new ICAL.Component();
let group: string;
let modExam: boolean;
let courses: Array<string>;
let modHeader: boolean;
let allCourses = ['EDA452', 'TDA555', 'TMV211', 'DAT044'];

module.exports.decodeURL = decodeURL;

function decodeURL(url: string) {
    if (url.includes("D_Schema-") && url.includes(".ics")) {
        //Isolate AES-128
        const encrypted = url.substring(url.indexOf("D_Schema-") + 9, url.indexOf(".ics"))
        //Decrypt to compressed style
        const decrypted = CryptoJS.AES.decrypt(encrypted, "13MONKELOVESBANANA37");
        //Uncompress
        const infosplit = decrypted.toString(CryptoJS.enc.Utf8).split('&');
        if (infosplit.length > 3) {
            group = "Grupp " + infosplit[0];
            modHeader = !!Number.parseInt(infosplit[1]);
            modExam = !!Number.parseInt(infosplit[2]);
            courses = infosplit.slice(3);
        } else
            return "Error: Invalid URL";
        iCal();
        buildForGroup({ group: group });
        return build().toString();
    }
    return "Error: Invalid URL";
}

function build() {
    if (!modExam) {
        rebuild()
        return comp;
    }
    let toRemove = allCourses.filter(function (value) {
        return !courses.includes(value);
    });
    toRemove.forEach(function (course) {
        getCourse(course).forEach(obj => {
            comp.removeSubcomponent(obj)
        });
    });

    if (modHeader)
        modHeaders();
    return comp;
}

function iCal() {
    const text = fs.readFileSync("./TimeEdit.ics", 'UTF-8');
    // Get the basic data out
    const jCalData = ICAL.parse(text);
    comp = new ICAL.Component(jCalData);
}

//Filters out events not relevant to selected group
function buildForGroup({ group }: { group: string }) {
    // @ts-ignore
    const groupChar = group.charAt(group.length - 1);
    comp.getAllSubcomponents('vevent').forEach((vevent: any) => {
        if (vevent.getFirstProperty('description') != null) {
            var desc = vevent.getFirstProperty('description').getFirstValue();
            let groupComponent = desc.match(/Grupp ([A-G]) och ([A-G])/);
            if (groupComponent != null && groupComponent.length == 3) {
                if (groupComponent[1] != groupChar && groupComponent[2] != groupChar) {
                    comp.removeSubcomponent(vevent);
                }
                return;
            }

            groupComponent = desc.match(/Grupp ([A-G])/)
            if (groupComponent != null && groupComponent.length == 2) {
                if (groupComponent[0] != groupChar)
                    comp.removeSubcomponent(vevent);
            }
        }
    }
    );

}

//If modExam is false we need to rebuild the calendar
function rebuild() {
    const newComp = new ICAL.Component(ICAL.parse(comp.toString()));
    newComp.removeAllSubcomponents('vevent');

    courses.forEach(function (course) {
        getCourse(course).forEach(obj => {
            newComp.addSubcomponent(obj)
        })
    });

    comp = newComp;

    if (modHeader)
        modHeaders();
}

function getCourse(course: string) {

    const col: any[] = [];
    // @ts-ignore
    comp.getAllSubcomponents('vevent').forEach(vevent => {
        var desc;
        if (vevent.getFirstProperty('summary') != null) {
            desc = vevent.getFirstProperty('summary').getFirstValue();
            if (desc.includes(course))
                col.push(vevent);
        }
    });
    return col;
}

//Get string to give beutified names for courses instead of course codes
function getCourseName(course: string) {
    switch (course) {
        case 'EDA452':
            return 'GruDat';
        case 'TDA555':
            return 'Funk Prog';
        case 'TMV211':
            return 'Diskmat';
        case 'DAT044':
            return 'OOP';
        default:
            return course;
    }
}

function modHeaders() {
    // @ts-ignore
    comp.getAllSubcomponents('vevent').forEach(vevent => {
        if (vevent.getFirstProperty('summary') != null) {
            const sum = vevent.getFirstProperty('summary').getFirstValue();
            if (allCourses.some(r => sum.includes(r)))
                vevent.getFirstProperty('summary').setValue(getCourseName(allCourses.find(r => sum.includes(r)) || ''));
            //If it also contains a description, we need to check for a certain regex match, if there are any, remove the description and add the match onto the summary.
            if (vevent.getFirstProperty('description') != null) {
                const desc = vevent.getFirstProperty('description').getFirstValue();
                const matches = desc.match(/Aktivitet: ([^\\]+)\n/);
                if (matches !== null) {
                    const activity = desc.match(/Aktivitet: ([^\\]+)\n/)[1].replace(" \nAktivitet: ", ", ");
                    vevent.removeProperty(vevent.getFirstProperty('description'));
                    vevent.getFirstProperty('summary').setValue(vevent.getFirstProperty('summary').getFirstValue() + '|' + activity);
                }
            }
        }

    });
}