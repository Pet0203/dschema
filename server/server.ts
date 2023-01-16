import * as https from "https";
import * as fs from "fs";

const express = require('express');
const cors = require('cors');
const CryptoJS = require("crypto-js");
const cal = require('./calendar');

const app = express();

app.use(express.json());
app.use(cors());

function callTimeEdit() {
  try {
    fs.truncate('./TimeEdit.ics', 0, function () {
    })
  } catch (e) {}
  //This link needs an occasional update! In use: 2023-01-16 to 2023-06-09
  https.get('https://cloud.timeedit.net/chalmers/web/public/ri.ics?sid=3&objects=197003.194&p=20230116.x%2C20230609.x&e=230116&enol=t', (res) => {

    // Open file in local filesystem
    const file = fs.createWriteStream(`TimeEdit.ics`);

    // Write data into local file
    res.pipe(file);

    // Close the file
    file.on('finish', () => {
      file.close();
      console.log(`TimeEdit cache updated`);
    });

  }).on("error", (err) => {
    console.log("TimeEdit cache error: ", err.message);
  });
  //TODO: Implement a better system for scheduling downloads?
  setTimeout(callTimeEdit, 2*3600*1000); //6h
}
//Start loop
callTimeEdit()

app.post('/api/v1/getUrl/', (req: any, res: any) => {
  // Object with below properties
  // String of group
  const group = req.body.group;
  // Boolean of whether to improve the location
  const modLocation = req.body.modLocation;
  // Boolean of whether to show exams in calendar
  const modExam = req.body.modExam;
  // Array of courses
  const courses = req.body.courses;

  /*We need the shortest possible "good looking" URL that still contains necessary information.
    We'll achieve this using lossless compression of the JSON String to raw data and then encrypt it with AES-128.
    Example:
    '{"group":"2","modLocation":true,"modExam":false,"courses":["ke","fy"]}' becomes '2&1&0&ke&fy' after compression
    and then 'yCjNbnkI8ts2tBy7BoL0qw==' after AES-128 with our secret '13MONKELOVESBANANA37'
  */
  let toEncrypt = group + "&" + (modLocation ? 1 : 0) + "&" + (modExam ? 1 : 0);
  for (const i in courses) {
    toEncrypt = toEncrypt.concat("&" + courses[i])
  }
  const encrypted = CryptoJS.AES.encrypt(toEncrypt, "13MONKELOVESBANANA37");
  //In dev:
  // const response = {url: req.get('Origin') + "/TB_Schema-" + encrypted + ".ics"};
  const response = {url: "https://tbschema.panivia.com/TB_Schema-" + encrypted + ".ics"};
  res.send(JSON.stringify(response));
});

app.get('/TB_Schema-*', (req: any, res: any) => {
  res.status(200)
      .attachment('tb_schema_subs.ics')
      .send(cal.decodeURL(req.url.substr(1)));
});

app.listen(3001, () => {
  console.log('The application is listening on port 3001!');
});
