var bodyParser = require('body-parser');
// var session = require('express-session');
var allowCrossDomain  = require('./middleware/cors');
var express = require('express');
var Bus = require('busmq');
var redis = require('redis');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var pkg = require('./package.json');
var DEFAULT_PORT = pkg.port;
var client;
var mysql = require('mysql');

global.ENV_ACTIVE = 'active';
global.ENV_DISABLE = '';

global.redisDomainKey = '_domains_list';
function connectMysql(callback) {

    var pool = mysql.createPool({
        connectionLimit: global.AppConfig.mysql.connectionPoolMaxSize,
        host: global.AppConfig.mysql.host,
        user: global.AppConfig.mysql.username,
        password: global.AppConfig.mysql.password,
        database: global.AppConfig.mysql.database
    });

    pool.getConnection(function (err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        console.log('Connect to mysql: ' + global.AppConfig.mysql.host);
        callback && callback();
    });

    global.Pool = pool;
}

function connectMongoDB(callback) {
    var MongoClient = require('mongodb').MongoClient;
    var assert = require('assert');

  // Connection URL
    var url = 'mongodb://' + global.AppConfig.mongodb.host + ':' + global.AppConfig.mongodb.port + '/' + global.AppConfig.mongodb.database;
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

        // var bus = Bus.create({ redis: ['redis://' + global.AppConfig.redis.host + ':' + global.AppConfig.redis.port] });

        var MService = require('./service/mysql-base');

        MService.query('SELECT domain.id, domain.endDateTime, domain.enabled, domain_env.name as _name, domain_env.logLevel as _logLevel, domain_env.email as _email FROM domain LEFT JOIN domain_env ON domain.id = domain_env.domainId',
          function (err, entity) {
              if (err) {
                  throw new Error(err);
              }
              var domains = {};
              var i, len = entity.length;
              var element, exists;

              for (i = 0; i < len; i++) {
                  element = entity[i];
                  exists = (element.id in domains);

                  if (!exists) {
                      domains[element.id] = '' + element.enabled;
                      domains[element.id + '.endDateTime'] = '' + element.endDateTime;
                  }
                  if (element._name) {
                      domains[element.id + '.' + element._name + '.logLevel'] = element._logLevel;
                      domains[element.id + '.' + element._name + '.email'] = element._email;
                      domains[element.id + '.' + element._name + '.active'] = global.ENV_ACTIVE;
                  }
              }
              console.log('domains', domains);
              var keys = Object.keys(domains);

              keys.forEach(function (k) {
                  client.set(k, domains[k]);
              });

              callback && callback();
          });

    });

    global.redisClient = client;
}

function startAppServer(db) {

    var app = express();

    app.use(session({
        secret: global.AppConfig.session.privateKey,
      // create new redis store.
        store: new RedisStore({ host: global.AppConfig.redis.host, port: global.AppConfig.redis.port, client: client, ttl: 1800 }),
        saveUninitialized: false,
        resave: false
    }));
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    app.use(allowCrossDomain);

    global.DB = db;
    require('./module/domain').init(app, db);
    require('./module/domain-user').init(app, db);
    require('./module/role').init(app, db);
    require('./module/group').init(app, db);
    require('./module/permission').init(app, db);
    require('./module/user').init(app, db);
    require('./module/actor').init(app, db);

    require('./module-login').init(app, db);

    var httpServer = require('http').createServer(app);

    httpServer.listen(DEFAULT_PORT, function () {
        console.info('Node server listening on ' + global.AppConfig.env.host);
    });
    var options = {
        redis: 'redis://' + global.AppConfig.redis.host + ':' + global.AppConfig.redis.port, // connect this bus to a local running redis
        federate: { // also open a federation server
            server: httpServer,  // use the provided http server as the federation server
            secret: 'cloud-secret',   // a secret key for authorizing clients
            path: '/ws/log' // the federation service is accessible on this path in the server
        }
    };
    var bus = Bus.create(options);

    bus.on('online', function () {
        global.MessageBus = bus;
  // the bus is now ready to receive federation requests
//         var s = bus.pubsub('my pubsub channel');
//
//         s.subscribe();

        var p = bus.pubsub('my pubsub channel');

        p.on('message', function (message) {
          // received message 'hello world' on subscribed channel
            console.log('message', message);
        });
        setTimeout(function () {
            p.publish({ name: 'hello world' });
        }, 5000);
    });
    bus.connect();
}

var Config = require('./config/config');

Config.init().then(function (configs) {
    global.AppConfig = configs;

    connectMysql(function () {
        connectRedis(function () {
            connectMongoDB(startAppServer);
        });
    });
}).catch(function (defaultPropertiesError, localPropertiesError) {
    throw new Error('Cannot load configurations: ' + defaultPropertiesError + localPropertiesError);
});
