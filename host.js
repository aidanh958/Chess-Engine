let fs = require("fs");
let http = require("http");
http.createServer((req, res) => {
    try {
        let file = fs.readFileSync("." + req.url);
        if (req.url.endsWith(".js")) res.writeHead(200, {"Content-Type": "text/javascript"});
        res.end(file.toString());
    }catch(err) {
        res.end("404");
    }
}).listen(8080);
