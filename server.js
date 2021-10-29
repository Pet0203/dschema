var express = require('express');
var app = express();
path = require('path');
var cal = require('./Calendar');

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'web/index.html'));
});

app.get('/api/getUrl', function(req, res){
    let data = req.url.substring(req.url.indexOf('?')+1).split('&');
    if (data.length !== 11)
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
