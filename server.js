var express = require('express');
var app = express();
path = require('path');
var cal = require('./Calendar');
const fs = require("fs");
const https = require('https');

function downloadiCal() {
    try {
        fs.truncate('./TimeEdit.ics', 0, function () {
        })
    } catch (e) {}
    https.get('https://cloud.timeedit.net/chalmers/web/public/ri6YZ066Z75Z6gQ2Y65500005642y4Y0nQ68X66Qg77660Q07.ics', (res) => {

        // Open file in local filesystem
        const file = fs.createWriteStream(`TimeEdit.ics`);

        // Write data into local file
        res.pipe(file);

        // Close the file
        file.on('finish', () => {
            file.close();
            console.log(`File downloaded!`);
        });

    }).on("error", (err) => {
        console.log("Error: ", err.message);
    });
    setTimeout(downloadiCal, 6*3600);
}

downloadiCal()

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'web/index.html'));
});

app.get('/api/getUrl', function(req, res){
    let data = req.url.substring(req.url.indexOf('?')+1).split('&');
    if (data.length !== 7)
        res.send("Invalid request.")
    res.send(cal.encodeURL(data));
});

app.get('/TB_Schema-:id', function(req, res){
    res.status(200)
        .attachment(req.url.substr(1))
        .send(cal.decodeURL(req.url.substr(1)));
});

app.use(express.static(path.join(__dirname, 'web')));

app.listen(8082);
