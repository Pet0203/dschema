var ICAL = require('ical.js');
var CryptoJS = require("crypto-js");
var base32 = require('hi-base32');
var fs = require("fs");
const https = require('https');

var comp = new ICAL.Component();
var group, fo, de, zode, ex, la, etc, loc, ma, fy, ke;

module.exports.decodeURL = decodeURL;
module.exports.encodeURL = encodeURL;

function decodeURL(url) {
    if (url.includes("TB_Schema-") && url.includes(".ics")) {
        var encoded = url.substring(url.indexOf("TB_Schema-") + 10, url.indexOf(".ics"))
        var decoded = base32.decode(encoded);
        var decrypted = CryptoJS.AES.decrypt(decoded, "13MONKELOVESBANANA37");
        var infosplit = decrypted.toString(CryptoJS.enc.Utf8).split(' ');
        group = infosplit[0];
        var info = infosplit[1].split('')
        if (info.length === 14) {
            fo = numToBool(info[0]);
            de = numToBool(info[1]);
            zode = numToBool(info[2]);
            ex = numToBool(info[3]);
            la = numToBool(info[4]);
            etc = numToBool(info[5]);
            loc = numToBool(info[6]);
            ma = numToBool(info[7]);
            fy = numToBool(info[8]);
            ke = numToBool(info[9]);
            var ver = ""+ info[10]+ info[11]+ info[12]+ info[13]
        }
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
    if(!fo) {getFos(comp).forEach(obj => {comp.removeSubcomponent(obj)});}
    if(!de) {getDes(comp).forEach(obj => {comp.removeSubcomponent(obj)});}
    if(!zode) {getZodes(comp).forEach(obj => {comp.removeSubcomponent(obj)});}
    if(!ex) {getExs(comp).forEach(obj => {comp.removeSubcomponent(obj)});}
    if(!la) {getLas(comp).forEach(obj => {comp.removeSubcomponent(obj)});}
    if(!ma) {getMas().forEach(obj => {comp.removeSubcomponent(obj)});}
    if(!fy) {getFys().forEach(obj => {comp.removeSubcomponent(obj)});}
    if(!ke) {getKes().forEach(obj => {comp.removeSubcomponent(obj)});}

    if(loc && fo)
        addFosLoc();
    return comp;
}

/* Var Table:
Group: Undergroup in ZBASS-1.X format               DONE
Fo: Föreläsning                                     DONE
De: Demonstration                                   DONE
Zode: Zoom-demonstration                            DONE
Ex: Övning                                          DONE
La: Laboration                                      DONE
Etc: Övrig                                          DONE
Loc: Whether we need changing of location or not    DONE
Ma: Math classes                                    DONE
Fy: Physics classes                                 DONE
Ke: Chemistry classes                               DONE
*/
function encodeURL(data = []) { //VER:1
    var uncodeUrl = data[0] + " " + strToBit(data[1]) + strToBit(data[2]) + strToBit(data[3]) + strToBit(data[4]) + strToBit(data[5]) + strToBit(data[6]) + strToBit(data[7]) + strToBit(data[8]) + strToBit(data[9]) + strToBit(data[10]) + "0001";
    var re = CryptoJS.AES.encrypt(uncodeUrl, "13MONKELOVESBANANA37");
    var ree = base32.encode(re.toString());
    return "TB_Schema-" + ree + ".ics";
}
function iCal(){
    fs.stat('./TimeEdit.ics', (err, stats) => {
        if (stats.mtime.getDate() !== new Date().getDate() || stats.mtime.getMonth() !== new Date().getMonth()) {
            const url = 'https://cloud.timeedit.net/chalmers/web/public/ri6YZ051Z35Z6gQ2Y65005005645y4Y0nQ68X76Qg77650Q03.ics';

            https.get(url,(res) => {
                // Image will be stored at this path
                const path = `./TimeEdit.ics`;
                const filePath = fs.createWriteStream(path);
                res.pipe(filePath);
                filePath.on('finish',() => {
                    filePath.close();
                })
            })
        }
    });
    var text = fs.readFileSync("./TimeEdit.ics", 'UTF-8');
        // Get the basic data out
        var jCalData = ICAL.parse(text);
        comp = new ICAL.Component(jCalData);
}

function strToBit(str){
    if(str !== 'false')
        return 1;
    return 0;
}

//Check if in SGrp group
function isInSGrp(SGrp, group) {
    switch(SGrp) {
        case 'A':
            if (group === "ZBASS-1.1" || group === "ZBASS-1.2" || group === "ZBASS-1.3")
                return true;
            break;
        case 'B':
            if (group === "ZBASS-1.4" || group === "ZBASS-1.5" || group === "ZBASS-1.6")
                return true;
            break;
        case 'C':
            if (group === "ZBASS-1.7" || group === "ZBASS-1.8" || group === "ZBASS-1.9")
                return true;
            break;
        case 'D':
            if (group === "ZBASS-1.10" || group === "ZBASS-1.11" || group === "ZBASS-1.12")
                return true;
            break;
        default:
            return false;
    }
    return false;
}

//Handles Group, and part of Loc
function buildForGroup(group) {
    comp.getAllSubcomponents('vevent').forEach(vevent => {
        if (vevent.getFirstProperty('description') != null) {
            var desc = vevent.getFirstProperty('description').getFirstValue();
            if (desc.includes('ZBASS-1.')) {
                if (desc.includes(group) && desc.charAt(desc.indexOf(group) + group.length) !== '0'
                    && desc.charAt(desc.indexOf(group) + group.length) !== '1'
                    && desc.charAt(desc.indexOf(group) + group.length) !== '2') {
                } else {
                    if (desc.includes('(SGrp ')) {
                        var start = desc.indexOf('(SGrp ');
                        var groups = desc.substring(start + 6, desc.indexOf('i  Zoom)', start))
                        var formattedGroups = groups.replace(',/g', '').replace(' /g', '').replace('\n/g', '').split('');
                        var zoom = false;
                        formattedGroups.forEach(sgrp => {
                            if (isInSGrp(sgrp, group))
                                zoom = true;
                        });
                        if (zoom) {
                            if (loc)
                                vevent.getFirstProperty('location').setValue('Zoom');
                        } else
                            comp.removeSubcomponent(vevent);
                    } else {
                        comp.removeSubcomponent(vevent);
                    }
                }
            }
        }
    });
}

function getFos(reComp){
    var col = [];
    reComp.getAllSubcomponents('vevent').forEach(vevent => {

        if (vevent.getFirstProperty('description') != null) {
            var desc = vevent.getFirstProperty('description').getFirstValue();
            if (desc.includes('Videoföreläsning')) {
                col.push(vevent);
            }

        }
    });
    return col;
}

function getDes(reComp){
    var col = [];
    reComp.getAllSubcomponents('vevent').forEach(vevent => {

        if (vevent.getFirstProperty('description') != null) {
            var desc = vevent.getFirstProperty('description').getFirstValue();
            if (desc.includes('Demonstration')) {
                if (vevent.getFirstProperty('location') != null) {
                    var desc = vevent.getFirstProperty('location').getFirstValue();
                    if (desc.includes('Zoom')) {
                        return;
                    }
                }
                col.push(vevent);
            }

        }
    })
    return col;
}

function getZodes(reComp){
    var col = [];
    reComp.getAllSubcomponents('vevent').forEach(vevent => {

        if (vevent.getFirstProperty('description') != null) {
            var desc = vevent.getFirstProperty('description').getFirstValue();
            if (desc.includes('Demonstration')) {
                if (vevent.getFirstProperty('location') != null) {
                    var desc = vevent.getFirstProperty('location').getFirstValue();
                    if (desc.includes('Zoom')) {
                        col.push(vevent);
                    }
                }
            }

        }
    })
    return col;
}

function getExs(reComp){
    var col = [];
    reComp.getAllSubcomponents('vevent').forEach(vevent => {

        if (vevent.getFirstProperty('description') != null) {
            var desc = vevent.getFirstProperty('description').getFirstValue();
            if (desc.includes('Exercise')) {
                col.push(vevent);
            }

        }
    })
    return col;
}

function getLas(reComp){
    var col = [];
    reComp.getAllSubcomponents('vevent').forEach(vevent => {

        if (vevent.getFirstProperty('description') != null) {
            var desc = vevent.getFirstProperty('description').getFirstValue();
            if (desc.includes('Laboration')) {
                col.push(vevent);
            }

        }
    })
    return col;
}

//If etc is false we need to rebuild the calendar
function rebuild(){
    var newComp = new ICAL.Component(ICAL.parse(comp.toString()));

    newComp.removeAllSubcomponents('vevent');

    if(ma) {getMas().forEach(obj => {newComp.addSubcomponent(obj)});}
    if(fy) {getFys().forEach(obj => {newComp.addSubcomponent(obj)});}
    if(ke) {getKes().forEach(obj => {newComp.addSubcomponent(obj)});}

    if(!fo) {getFos(newComp).forEach(obj => {newComp.removeSubcomponent(obj)});}
    if(!de) {getDes(newComp).forEach(obj => {newComp.removeSubcomponent(obj)});}
    if(!zode) {getZodes(newComp).forEach(obj => {newComp.removeSubcomponent(obj)});}
    if(!ex) {getExs(newComp).forEach(obj => {newComp.removeSubcomponent(obj)});}
    if(!la) {getLas(newComp).forEach(obj => {newComp.removeSubcomponent(obj)});}

    comp = newComp;

    if(loc && fo)
        addFosLoc();
}

function getMas(){
    var col = [];
    comp.getAllSubcomponents('vevent').forEach(vevent => {

        if (vevent.getFirstProperty('summary') != null) {
            var desc = vevent.getFirstProperty('summary').getFirstValue();
            if (desc.includes('Matematik')) {
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
            if (desc.includes('Fysik')) {
                col.push(vevent);
            }

        }
    })
    return col;
}

function getKes(){
    var col = [];
    comp.getAllSubcomponents('vevent').forEach(vevent => {

        if (vevent.getFirstProperty('summary') != null) {
            var desc = vevent.getFirstProperty('summary').getFirstValue();
            if (desc.includes('Kemi')) {
                col.push(vevent);
            }

        }
    })
    return col;

}

function addFosLoc() {
        comp.getAllSubcomponents('vevent').forEach(vevent => {

            if (vevent.getFirstProperty('description') != null) {
                var desc = vevent.getFirstProperty('description').getFirstValue();
                if (desc.includes('Videoföreläsning')) {
                    vevent.getFirstProperty('location').setValue('Inspelad på Canvas');
                }

            }
        });
}
