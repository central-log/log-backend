var http = require('http');
var fs = require('fs');
var bodyParser = require('body-parser');
// var session = require('express-session');
var allowCrossDomain  = require('./middleware/cors');
var express = require('express');
var pkg = require('./package.json');
var app = express();
var DEFAULT_PORT = pkg.port;

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json
app.use(allowCrossDomain);

function connectMongoDB(callback){
  var MongoClient = require('mongodb').MongoClient;
  var assert = require('assert');

  // Connection URL
  var url = 'mongodb://localhost:27017/central-log-management';
  // Use connect method to connect to the Server
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to mongodb server");
    callback && callback(db);
  });
}

function startAppServer(db){
  global.DB = db;
  require('./module-domain').init(app,db);
  require('./module-role').init(app, db);
  require('./module-group').init(app, db);
  require('./module-user').init(app, db);
  require('./module-login').init(app, db);
  require('./module-location').init(app, db);
  require('./module-menu').init(app, db);

  require('http').createServer(app).listen(DEFAULT_PORT, function() {
    console.info('Node server listening on https://localhost:' + DEFAULT_PORT);
  });
}

connectMongoDB(startAppServer);
