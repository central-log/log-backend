var jwt = require('jsonwebtoken');
var MService = require('../service/mysql-base');
var Logs = require('../service/logs');
var privateKey = 'hello-cloud-log';

module.exports = {
    init: function (app) {
        app.post('/log/auth', function (req, res) {
            var body = req.body;

            if (!body.username || !body.password || !body.envName) {
                res.status(400).send('Bad Request! Required Parameters: username, password, envName');
                return;
            }

            MService.query('SELECT endDateTime FROM domain WHERE id=? AND secret=?',
              [body.username, body.password],
              function (e, entity) {
                  if (e) {
                      res.status(500).send({ errMsg: '服务器异常，请稍后再试' });
                      return;
                  }

                  if (!entity[0]) {
                      return res.status(403).send({ errMsg: '用户名或密码错误' });
                  }
                  if (entity[0]) {
                      // eslint-disable-next-line
                      var startTime = new Date().getTime();
                      // eslint-disable-next-line
                      var endDateTime = parseFloat(entity[0].endDateTime);

                      if (startTime > endDateTime) {
                          return res.status(403).send({ errMsg: '当前状态为：已过期。' + '接入有效期截止' + new Date(endDateTime) });
                      }

                      // eslint-disable-next-line
                      var token = jwt.sign({
                          data: {
                              domainId: body.username,
                              envName: body.envName
                          }
                      }, privateKey, { expiresIn: parseInt((endDateTime - startTime) / 1000, 10) });

                      return res.json(token);
                  }
              });

        });

        app.post('/logs', function (req, res) {
            if (!req.headers || !req.headers.token) {
                res.status(400).send('Bad Request! Required Parameters: token');
                return;
            }

            jwt.verify(req.headers.token, privateKey, function (err, decoded) {
                if (err) {
                    return res.status(403).send({ errMsg: 'Invalid token' });
                }
                global.redisClient.get(decoded.domainId, function (e, status) {
                    // Domain status is Active
                    if (e) {
                        return res.status(500).send('Redis Server Error：', e);
                    }
                    if (status !== '1') {
                        return res.status(403).send({ errMsg: '对接系统接入状态为：已禁用。' });
                    }
                    global.redisClient.get(decoded.domainId + '.endDateTime', function (e2, endDateTime) {
                        if (e2) {
                            return res.status(500).send('Redis Server Error：', e);
                        }
                        // Domain status is Active
                        if (endDateTime < new Date().getTime()) {
                            return res.status(403).send({ errMsg: '系统接入有效期已过期。' + '接入有效期截止' + new Date(endDateTime) });
                        }

                        Logs.add({
                            domainId: decoded.domainId,
                            envName: decoded.envName,
                            level: req.body.level,
                            timeStamp: req.body.timeStamp,
                            msg: req.body.msg
                        }, function (e3) {
                            if (e3) {
                                return res.status(500).send('Save message error: ', e3);
                            }
                            global.redisClient.get(decoded.domainId + '.' + decoded.envName + '.logLevel', function (e4, level) {
                                return res.json({
                                    level: e4 ? req.body.level : level
                                });
                            });
                        });

                    });
                });

            });

        });

        app.post('/logs/realtime', function (req, res) {
            if (!('open' in req.body)) {
                return res.status(400).send('Bad Request! Required Parameters: status');
            }
            if (req.body.open) {
                if (!req.session.publish) {
                    req.session.publish = global.MessageBus.pubsub(req.session.email);
                }
            } else {
                req.session.publish.publish('closed');
                req.session.publish = null;
            }
        });

    }
};
