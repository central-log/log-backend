var express = require('express'),
    http = require('http'),
    fs = require('fs'),
    bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
var port = 8081;

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json
/*app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))*/

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    res.cookie('tk', 'mock-server-token', { domain: '.hubenlv.com', path: '/', httpOnly: true });
    res.cookie('notHttpOnly', 'haha', { domain: '.hubenlv.com', path: '/', httpOnly: false });
    res.cookie('notDomain', 'ooo', { path: '/', httpOnly: false });
    res.cookie('JSESSIONID', 'F415EDBA3589501A7A48434D9EA180F6', { path: '/', httpOnly: true });

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
};
var consoleLogParams = function(req, res, next) {

    console.log('params: ', req.params);
    console.log('query: ', req.query);
    //console.log('body: ', req.body);

    next();
};
app.use(allowCrossDomain);
app.use(consoleLogParams);

require('./module-domain').init(app);
require('./module-role').init(app);
require('./module-group').init(app);
require('./module-user').init(app);
require('./module-login').init(app);
require('./module-location').init(app);
require('./module-menu').init(app);

var options = {
  key: fs.readFileSync('./privatekey.pem'),
  cert: fs.readFileSync('./certificate.pem')
};

require('http').createServer(app).listen(port, function() {
    console.info('Mock server listening on https://localhost:' + port);
});
