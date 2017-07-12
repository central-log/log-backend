var md5 = require('md5');
var MService = require('../service/mysql-base');

module.exports = {
    init: function (app) {
        app.post('/actor', function (req, res) {
            var body = req.body;

            if (!body.username || !body.password) {
                res.status(400).send('Bad Request! Required Parameters: username, password');
                return;
            }

            MService.query('SELECT email FROM users WHERE email=? AND password=?',
              [body.username, md5(body.password)], function (e, entity) {
                  if (e) {
                      res.status(500).send(e);
                      return;
                  }
                  req.session.email = body.username;
                  res.json(entity[0] || {});
              });
        });

        app.post('/actor/logout', function (req, res) {
            req.session.email = null;
            req.session.destroy(function () {
                res.sendStatus(204);
            });
        });

        app.get('/actor', function (req, res) {
            if (req.session.email) {
                return res.json({
                    email: req.session.email
                });
            } else {
                return res.json({});
            }
        });
    }
};
