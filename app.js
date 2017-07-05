var bodyParser = require('body-parser');
// var session = require('express-session');
var allowCrossDomain  = require('./middleware/cors');
var express = require('express');
var redis = require('redis');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var pkg = require('./package.json');
var DEFAULT_PORT = pkg.port;
var client;

function connectMongoDB(callback) {
    var MongoClient = require('mongodb').MongoClient;
    var assert = require('assert');

  // Connection URL
    var url = 'mongodb://localhost:27017/central-log-management';
  // Use connect method to connect to the Server

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log('Connected correctly to mongodb server ' + url);
        callback && callback(db);
    });
}

function connectRedis(callback) {

    client = redis.createClient(global.AppConfig.redis.port, global.AppConfig.redis.host);

    client.on('connect', function () {
        console.info('Connect to redis server ' + global.AppConfig.redis.host + ' on port:' + global.AppConfig.redis.port);
        callback && callback();
    });
}

function startAppServer(db) {

    var app = express();

    app.use(session({
        secret: global.AppConfig.session.privateKey,
      // create new redis store.
        store: new RedisStore({ host: global.AppConfig.redis.host, port: global.AppConfig.redis.port, client: client, ttl: 260 }),
        saveUninitialized: false,
        resave: false
    }));
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    app.use(allowCrossDomain);

    global.DB = db;
    require('./module/domain').init(app, db);
    require('./module-group').init(app, db);
    require('./module/user').init(app, db);
    require('./module/actor').init(app, db);
    require('./module-login').init(app, db);
    require('./module-location').init(app, db);
    require('./module-menu').init(app, db);

    require('http').createServer(app).listen(DEFAULT_PORT, function () {
        console.info('Node server listening on https://localhost:' + DEFAULT_PORT);
    });
}

var Config = require('./config/config');

Config.init().then(function (configs) {
    global.AppConfig = configs;

    connectRedis(function () {
        connectMongoDB(startAppServer);
    });
}).catch(function (defaultPropertiesError, localPropertiesError) {
    throw new Error('Cannot load configurations: ' + defaultPropertiesError + localPropertiesError);
});
