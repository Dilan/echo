var connect = require('connect');
connect.createServer(
    connect.static("web")
).listen(1337, "127.0.0.1");

console.log("Server running at http://127.0.0.1:1337/");

var open = require('open');
open('http://127.0.0.1:1337/');