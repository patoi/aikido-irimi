var connect = require('connect'),
    serveStatic = require('serve-static');

var app = connect();

app.use(serveStatic("./public"));
app.listen(4000);

livereload = require('livereload');
server = livereload.createServer();
server.watch(__dirname);
