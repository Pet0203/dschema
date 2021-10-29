var http = require('http');
var url = require('url');
var fs = require('fs');
var cal = require('./Calendar');
var server = http.createServer(function (request, response) {
    try {
    if (request.url === "/")
        request.url = "/index.html";
    if (request.url.includes(".ics")) {
        response.setHeader('Content-Disposition', 'attachment; filename=' + request.url.substr(1));
        response.setHeader('Content-Transfer-Encoding', 'binary');
        response.setHeader('Content-Type', 'application/octet-stream');
        response.end(cal.decodeURL(request.url.substr(1)))
        return;
    }
    if(request.url.includes("/api/getUrl?")){
        var data = request.url.substring(request.url.indexOf('?')+1).split('&')
        if (data.length !== 11) {
            response.end("Invalid request.")
            return;
        }
        response.setHeader('Content-type' , 'text/plain');
        response.end(cal.encodeURL(data));
        return;
    }

    fs.readFile('./web' + request.url, function(err, data) {
        if (!err) {
            var dotoffset = request.url.lastIndexOf('.');
            var mimetype = dotoffset == -1
                ? 'text/plain'
                : {
                    '.html' : 'text/html',
                    '.ico' : 'image/x-icon',
                    '.jpg' : 'image/jpeg',
                    '.png' : 'image/png',
                    '.gif' : 'image/gif',
                    '.css' : 'text/css',
                    '.js' : 'text/javascript',
                }[ request.url.substr(dotoffset) ];
            response.setHeader('Content-type' , mimetype);
            response.end(data);
            console.log( request.url, mimetype );
        } else {
            console.log ('file not found: ' + request.url);
            response.writeHead(404, "Not Found");
            response.end();
        }
    });    } catch (error) {
        console.error(error);
    }
})
server.listen(8082);