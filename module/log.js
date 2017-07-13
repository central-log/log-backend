var jwt = require('jsonwebtoken');
var MService = require('../service/mysql-base');
var Logs = require('../service/logs');
var privateKey = 'hello-cloud-log';

module.exports = {
    init: function (app) {
        app.post('/log/auth', function (req, res) {
            var body = req.body;

            if (!body.username || !body.password || !body.envName) {
                res.status(400).send('Bad Request! Required Parameters: username, password');
                return;
            }

            MService.query('SELECT endDateTime FROM domain WHERE id=? AND key=?',
              [body.username, body.password],
              function (e, entity) {
                  if (e) {
                      res.status(500).send(e);
                      return;
                  }

                  if (entity[0]) {
                      // eslint-disable-next-line
                      var startTime = new Date().getTime();
                      // eslint-disable-next-line
                      var endDateTime = parseFloat(entity[0].endDateTime);

                      if (startTime > endDateTime) {
                          return res.status(403).send('用户名或密码错误');
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
                  return res.status(403).send('用户名或密码错误');

              });

        });

        app.post('/logs', function (req, res) {
            if (!req.headers || !req.headers.token) {
                res.status(403).send('Bad Request! Required Parameters: token');
                return;
            }

            jwt.verify(req.headers.token, privateKey, function (err, decoded) {
                if (err) {
                    return res.status(403).send('Bad Request! Required Parameters: Invalid token', err);
                }
                Logs.add({
                    domainId: decoded.domainId,
                    envName: decoded.envName,
                    level: req.body.level,
                    timeStamp: req.body.timeStamp,
                    msg: req.body.msg
                }, function (e) {
                    if (e) {
                        return res.status(403).send('Save message error: ', e);
                    }
                    return res.json({
                        level: req.body.level
                    });
                });
            });

        });

        app.get('/logs', function (req, res) {
          
        });

    }
};
