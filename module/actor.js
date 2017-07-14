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
            MService.query('SELECT domain_env.id, domain_env.domainId, env_users.status FROM users LEFT JOIN env_users ON env_users.userId=users.email LEFT JOIN domain_env ON domain_env.id=env_users.envId WHERE users.email=? AND users.password=? ',
              [body.username, md5(body.password)], function (e, entity) {
                  if (e) {
                      res.status(500).send(e);
                      return;
                  }
                  console.log(entity);
                  if (!entity[0]) {
                      return res.status(403).send({ errMsg: '用户名或密码错误' });
                  }
                  entity[0].email = body.username;
                  req.session.email = body.username;
                  return res.json(entity[0] || {});
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
