const _fs = require("fs");
const _url = require("url");
const _http = require("http");
const _port = 3000;
const _startupMessage = "Treeview Demo Server listening on port " + _port + "...";
const _httpHandler = function (request, response) {
    const url = _url.parse(request.url);
    switch (url.pathname) {
        default: {
            response.writeHead(200);
            response.end(_startupMessage);
            break;
        }
        case "/demo.html":
        case "/":
        case "": {
            response.setHeader("Content-Type", "text/html");
            response.end(_fs.readFileSync("./demo.html"));
            break;
        }
        case "/Views/treeview.html": {
            response.setHeader("Content-Type", "text/html");
            response.end(_fs.readFileSync("../Views/treeview.html"));
            break;
        }
        case "/Views/treeitem.html": {
            response.setHeader("Content-Type", "text/html");
            response.end(_fs.readFileSync("../Views/treeitem.html"));
            break;
        }
        case "/treeview.js": {
            response.setHeader("Content-Type", "text/javascript");
            response.end(_fs.readFileSync("../treeview.js"));
            break;
        }
        case "/treeview.min.js": {
            response.setHeader("Content-Type", "text/javascript");
            response.end(_fs.readFileSync("../treeview.min.js"));
            break;
        }
        case "/angular.min.js": {
            response.setHeader("Content-Type", "text/javascript");
            response.end(_fs.readFileSync("../node_modules/angular/angular.min.js"));
            break;
        }
        case "/angular.min.js.map": {
            response.setHeader("Content-Type", "application/octet-stream");
            response.end(_fs.readFileSync("../node_modules/angular/angular.min.js.map"));
            break;
        }
        case "/demo.json": {
            response.setHeader("Content-Type", "application/json");
            response.end(_fs.readFileSync("./demo.json"));
            break;
        }
        case "/treeview.css": {
            response.setHeader("Content-Type", "text/css");
            response.end(_fs.readFileSync("../treeview.css"));
            break;
        }
        case "/Images/folder.gif":
        case "/Images/open.gif":
        case "/Images/plus.gif":
        case "/Images/minus.gif":
        case "/Images/file.gif":
        case "/Images/line.gif": {
            response.setHeader("Content-Type", "image/gif");
            response.end(_fs.readFileSync(".." + url.pathname));
            break;
        }
    }
    
};
_http.createServer(_httpHandler).listen(_port, function () {
    console.log(_startupMessage);
});