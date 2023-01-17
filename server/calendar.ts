const ICAL = require('ical.js');
const CryptoJS = require("crypto-js");
const fs = require("fs");
let comp = new ICAL.Component();
let group: string;
let modExam: boolean;
let courses: Array<string>;
let modLocation: boolean;

module.exports.decodeURL = decodeURL;

function decodeURL(url: string) {
    if (url.includes("TB_Schema-") && url.includes(".ics")) {
        //Isolate AES-128
        const encrypted = url.substring(url.indexOf("TB_Schema-") + 10, url.indexOf(".ics"))
        //Decrypt to compressed style
        const decrypted = CryptoJS.AES.decrypt(encrypted, "13MONKELOVESBANANA37");
        //Uncompress
        const infosplit = decrypted.toString(CryptoJS.enc.Utf8).split('&');
        if (infosplit.length > 3 ) {
            group = "ZBASS-1." + infosplit[0];
            modLocation = !!Number.parseInt(infosplit[1]);
            modExam = !!Number.parseInt(infosplit[2]);
            courses = infosplit.slice(3);
        } else
            return false;
        iCal();
        buildForGroup({group: group});
        return build().toString();
    }
    return false;
}

function build(){
    if (!modExam) {
        rebuild()
        return comp;
    }
    let allCourses = ['ma', 'ke', 'fy', 'pfy', 'pke', 'pro'];
    let toRemove = allCourses.filter(function (value) {
        return !courses.includes(value);
    });
    toRemove.forEach(function (course){
        getCourse(course).forEach(obj => {
            comp.removeSubcomponent(obj)
        });
    });

    if(modLocation)
        modLoc();
    return comp;
}

function iCal() {
    const text = fs.readFileSync("./TimeEdit.ics", 'UTF-8');
    // Get the basic data out
    const jCalData = ICAL.parse(text);
    comp = new ICAL.Component(jCalData);
}

//Filters out events not relevant to selected group
function buildForGroup({group}: { group: string }) {
    const toCheck = ['description', 'summary'];
    toCheck.forEach(function (check){
        // @ts-ignore
        comp.getAllSubcomponents('vevent').forEach(vevent => {
            if (vevent.getFirstProperty(check) != null) {
                //Remove awful headers added by TimeEdit
                const locData = vevent.getFirstProperty('location').getFirstValue();
                if (locData.includes('Hus:') && locData.match(/(?<=Hus: )(.*?)(?=\s*\.)/) != null)
                    vevent.getFirstProperty('location').setValue(locData.match(/(?<=Hus: )(.*?)(?=\s*\.)/)[0]);
                const sumData = vevent.getFirstProperty('summary').getFirstValue();
                if (sumData.includes('Kursnamn: ') && sumData.match(/(?<=Kursnamn: )(.*?)(?=\s*,)/) != null)
                    vevent.getFirstProperty('summary').setValue(sumData.match(/(?<=Kursnamn: )(.*?)(?=\s*,)/)[0]);

                var desc = vevent.getFirstProperty(check).getFirstValue();
                if (desc.includes('ZBASS-1.') && (!desc.includes(group) || desc.charAt(desc.indexOf(group) + group.length) === '0'))
                    comp.removeSubcomponent(vevent);
                if (desc.match(/[0-9]--[0-9]+/) !== null) {
                    //Build interval
                    const groupComponent = desc.match(/[0-9]--[0-9]+/)[0];
                    const firstGroup = parseInt(groupComponent.substring(0, groupComponent.indexOf('--')));
                    const lastGroup = parseInt(groupComponent.substring(groupComponent.indexOf('--') + 2));
                    //Get group number
                    const groupNum = parseInt(group.substring(8))
                    //Remove if outside of interval
                    if (firstGroup > groupNum || lastGroup < groupNum)
                        comp.removeSubcomponent(vevent);
                }
                if (desc.match(/[0-9]-[0-9]+/) !== null) {
                    //Build interval
                    const groupComponent = desc.match(/[0-9]-[0-9]+/)[0];
                    const firstGroup = parseInt(groupComponent.substring(0, groupComponent.indexOf('-')));
                    const lastGroup = parseInt(groupComponent.substring(groupComponent.indexOf('-') + 1));
                    //Get group number
                    const groupNum = parseInt(group.substring(8))
                    //Remove if outside of interval
                    if (firstGroup > groupNum || lastGroup < groupNum)
                        comp.removeSubcomponent(vevent);
                }
            }
        });
    })

}

//If modExam is false we need to rebuild the calendar
function rebuild(){
    const newComp = new ICAL.Component(ICAL.parse(comp.toString()));
    newComp.removeAllSubcomponents('vevent');

    courses.forEach(function (course){
        getCourse(course).forEach(obj => {
            newComp.addSubcomponent(obj)
        })
    });

    comp = newComp;

    if(modLocation)
        modLoc();
}

function getCourse(course: string){
    const coursemap = new Map([
        ['ma', 'MVE426'],
        ['fy', 'LMA538'],
        ['ke', 'LET924'],
        ['pfy', 'MVE285'],
        ['pke', 'KBT185']
    ]);

    const col: any[] = [];
    // @ts-ignore
    comp.getAllSubcomponents('vevent').forEach(vevent => {
        var desc;

        if (vevent.getFirstProperty('description') != null) { //Special case for programming which is in the same course as MVE426
            desc = vevent.getFirstProperty('description').getFirstValue();
            if (desc.includes('Programming')) {
                if (course === 'pro')
                    col.push(vevent);
                else
                    return;
            }
        }
        if (vevent.getFirstProperty('summary') != null) {
            desc = vevent.getFirstProperty('summary').getFirstValue();
            if (desc.includes(coursemap.get(course)))
                col.push(vevent);
        }
    });
    return col;
}

function modLoc() {
    // @ts-ignore
    comp.getAllSubcomponents('vevent').forEach(vevent => {

        if (vevent.getFirstProperty('description') != null) {
            const desc = vevent.getFirstProperty('description').getFirstValue();
            if (desc.includes('Zoom')) {
                vevent.getFirstProperty('location').setValue('Zoom');
            }
            else if (desc.includes('Videoföreläsning')) {
                vevent.getFirstProperty('location').setValue('Videoföreläsning');
            }
        }
        if (vevent.getFirstProperty('location') != null) {
            const desc = vevent.getFirstProperty('location').getFirstValue();
            if (desc.includes('Styrbord') || desc.includes('Babord') || desc.includes('Svea') || desc.includes('Jupiter') ||
                desc.includes('Saga') || desc.includes('Bryggan') || desc.includes('Gnistan') || desc.includes('Delta')) {
                vevent.getFirstProperty('location').setValue('Lindholmen | ' + desc);
            }
            if (desc.includes('KB') || desc.includes('SB') || desc.includes('FL') || desc.includes('EL') ||
                desc.includes('HB') || desc.includes('KE') || desc.includes('KS') || desc.includes('HC') ||
                desc.includes('ML') || desc.match(/F\d\d\d\d/) !== null) {
                vevent.getFirstProperty('location').setValue('Johanneberg | ' + desc);
            }
        }
    });
}