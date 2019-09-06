var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");

var app = http.createServer(function(req,res) {
    var uri = url.parse(
        req.url == "/" ? "/index.html" : req.url
    ).pathname;
    var filename = path.join(process.cwd(), "web", uri);
    var ext = path.parse(filename).ext;
    var mimeType = MimeType();

    fs.exists(filename, function(exists) {
        if (!exists) {
            console.log(filename + "not found");
            return;
        }

        fs.readFile(filename, "binary", function(err,file) {
            if (err) {
              console.log(err);
              return;
            }

            res.setHeader('Content-type', mimeType[ext] || 'text/plain' );
            res.writeHead(200);
            res.end(file, "binary");
        });
    });
}).listen(1337);

console.log("Server running at http://127.0.0.1:1337");


// maps file extention to MIME types
function MimeType() {
    return {
        '.ico': 'image/x-icon',
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.eot': 'appliaction/vnd.ms-fontobject',
        '.ttf': 'aplication/font-sfnt'
    }
}
