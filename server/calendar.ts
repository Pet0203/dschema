const ICAL = require('ical.js');
const CryptoJS = require("crypto-js");
const fs = require("fs");
let comp = new ICAL.Component();
let group: string;
let modExam: boolean;
let useRetro: boolean;
let courses: Map<string, number>;
let modHeader: boolean;
let allCourses = ['EDA452', 'TDA555', 'TMV211', 'DAT044', 'DAT017', 'TMV216', 'EDA343', 'TMV170'];

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
            let prot_Ver = infosplit[0];
            if (infosplit.length > 4 && prot_Ver == "3") {
                modHeader = !!Number.parseInt(infosplit[1]);
                modExam = !!Number.parseInt(infosplit[2]);
                useRetro = !!Number.parseInt(infosplit[3]);
                let courGroups = infosplit.slice(4);
                for (let i = 0; i < courGroups.length; i += 2) {
                    courses.set(courGroups[i], Number.parseInt(courGroups[i + 1]))
                }
            }
            else if (infosplit.length > 5 && prot_Ver == "2") {
                group = "Grupp " + infosplit[1];
                modHeader = !!Number.parseInt(infosplit[2]);
                modExam = !!Number.parseInt(infosplit[3]);
                useRetro = !!Number.parseInt(infosplit[4]);
                courses = infosplit.slice(5);
            } else {
                group = "Grupp " + infosplit[0];
                modHeader = !!Number.parseInt(infosplit[1]);
                modExam = !!Number.parseInt(infosplit[2]);
                useRetro = false
                courses = infosplit.slice(3);
            }
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
        return !courses.has(value);
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
    let text;
    if (useRetro)
        text = fs.readFileSync("./caches/TimeEditRetro.ics", 'UTF-8');
    else
        text = fs.readFileSync("./caches/TimeEdit.ics", 'UTF-8');
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
                if (groupComponent[1] != groupChar)
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

    //Do this below for each course (key)
    courses.forEach((value, course) => {
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
        case 'DAT017':
            return 'MOP';
        case 'TMV216':
            return 'LinAlg';
        case 'EDA343':
            return 'CompCom';
        case 'TMV170':
            return 'Calculus';
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
                if (desc.match('Reserv'))
                    vevent.getFirstProperty('summary').setValue(vevent.getFirstProperty('summary').getFirstValue() + ' (Reserv)');
            }
        }

    });
}