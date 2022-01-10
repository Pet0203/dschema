const ICAL = require('ical.js');
const CryptoJS = require("crypto-js");
const base32 = require('hi-base32');
const fs = require("fs");
let comp = new ICAL.Component();
let group, etc, loc, ma, fy, pfy, pke;

module.exports.decodeURL = decodeURL;
module.exports.encodeURL = encodeURL;

function decodeURL(url) {
    if (url.includes("TB_Schema-") && url.includes(".ics")) {
        const encoded = url.substring(url.indexOf("TB_Schema-") + 10, url.indexOf(".ics"))
        const decoded = base32.decode(encoded);
        const decrypted = CryptoJS.AES.decrypt(decoded, "13MONKELOVESBANANA37");
        const infosplit = decrypted.toString(CryptoJS.enc.Utf8).split(' ');
        group = infosplit[0];
        const info = infosplit[1].split('')
        if (info.length === 10) {
            etc = numToBool(info[0]);
            loc = numToBool(info[1]);
            ma = numToBool(info[2]);
            fy = numToBool(info[3]);
            pfy = numToBool(info[4])
            pke = numToBool(info[5]);
            //var ver = ""+ info[6]+ info[7]+ info[8]+ info[9] Unused
        } else
            return false;
    iCal();
    buildForGroup(group);
        return build().toString();
    }
    return false;
}

function numToBool(num){
    return num === "1";

}

function build(){
    if (!etc) {
        rebuild()
        return comp;
    }
    if(!ma) {getMas().forEach(obj => {comp.removeSubcomponent(obj)});}
    if(!fy) {getFys().forEach(obj => {comp.removeSubcomponent(obj)});}
    if(!pfy) {getPFys().forEach(obj => {comp.removeSubcomponent(obj)});}
    if(!pke) {getPKes().forEach(obj => {comp.removeSubcomponent(obj)});}

    if(loc)
        modLoc();
    return comp;
}

/* Var Table:
Group: Undergroup in ZBASS-1.X format               DONE
Etc: Övrig                                          DONE
Loc: Whether we need changing of location or not    DONE
Ma: Math classes                                    DONE
Fy: Physics classes                                 DONE
PFy: Physics-project classes                        DONE
PKe: Chemistry-project classes                      DONE
*/
function encodeURL(data = []) { //VER:2
    let uncodeUrl = data[0] + " ";
    for (i = 1; i < data.length; i++)
            uncodeUrl = uncodeUrl + strToBit(data[i])
    uncodeUrl = uncodeUrl + '0002';
    const re = CryptoJS.AES.encrypt(uncodeUrl, "13MONKELOVESBANANA37");
    const ree = base32.encode(re.toString());
    return "TB_Schema-" + ree + ".ics";
}
function iCal() {
    const text = fs.readFileSync("./TimeEdit.ics", 'UTF-8');
    // Get the basic data out
    const jCalData = ICAL.parse(text);
    comp = new ICAL.Component(jCalData);
}

function strToBit(str){
    if(str !== 'false')
        return 1;
    return 0;
}

//Handles Group
function buildForGroup(group) {
    comp.getAllSubcomponents('vevent').forEach(vevent => {
        if (vevent.getFirstProperty('description') != null) {
            var desc = vevent.getFirstProperty('description').getFirstValue();
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
        }
    });
}




//If etc is false we need to rebuild the calendar
function rebuild(){
    var newComp = new ICAL.Component(ICAL.parse(comp.toString()));

    newComp.removeAllSubcomponents('vevent');

    if(ma) {getMas().forEach(obj => {newComp.addSubcomponent(obj)});}
    if(fy) {getFys().forEach(obj => {newComp.addSubcomponent(obj)});}
    if(pfy) {getPKes().forEach(obj => {newComp.addSubcomponent(obj)});}
    if(pke) {getPKes().forEach(obj => {newComp.addSubcomponent(obj)});}


    comp = newComp;

    if(loc)
        modLoc();
}

function getMas(){
    var col = [];
    comp.getAllSubcomponents('vevent').forEach(vevent => {

        if (vevent.getFirstProperty('summary') != null) {
            var desc = vevent.getFirstProperty('summary').getFirstValue();
            if (desc.includes('MVE426')) {
                col.push(vevent);
            }

        }
    })
    return col;
}

function getFys(){
    var col = [];
    comp.getAllSubcomponents('vevent').forEach(vevent => {

        if (vevent.getFirstProperty('summary') != null) {
            var desc = vevent.getFirstProperty('summary').getFirstValue();
            if (desc.includes('LMA538')) {
                col.push(vevent);
            }

        }
    })
    return col;
}

function getPFys(){
    var col = [];
    comp.getAllSubcomponents('vevent').forEach(vevent => {

        if (vevent.getFirstProperty('summary') != null) {
            var desc = vevent.getFirstProperty('summary').getFirstValue();
            if (desc.includes('MVE285')) {
                col.push(vevent);
            }

        }
    })
    return col;
}

function getPKes(){
    var col = [];
    comp.getAllSubcomponents('vevent').forEach(vevent => {

        if (vevent.getFirstProperty('summary') != null) {
            const desc = vevent.getFirstProperty('summary').getFirstValue();
            if (desc.includes('KBT185')) {
                col.push(vevent);
            }

        }
    })
    return col;

}

function modLoc() {
    comp.getAllSubcomponents('vevent').forEach(vevent => {

        if (vevent.getFirstProperty('description') != null) {
            const desc = vevent.getFirstProperty('description').getFirstValue();
            if (desc.includes('Film-föreläsning')) {
                vevent.getFirstProperty('location').setValue('Inspelad på Canvas');
            }
            if (desc.includes('Zoom')) {
                vevent.getFirstProperty('location').setValue('Zoom');
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
//Debug stuff
const encode = encodeURL(["ZBASS-1.4", "true", "true", "true", "true", "true", "false"]);
console.log(encode);
console.log(decodeURL(encode).toString());
