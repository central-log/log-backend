var MService = require('../service/mysql-base');
var PaginationResponse = require('../entity/PaginationResponse');
var Mail = require('../service/mail');
var Password = require('../service/password');
var md5 = require('md5');
var Utils = require('../utils/Utils');
var userTableName = 'users';
var envUsersTableName = 'env_users';
var configHost = Utils.ensureSlash(global.AppConfig.env.host, true);

module.exports = {
    init: function (app) {
        app.get('/user', function (req, res) {
            var query = req.query;

            if (!query.page || !query.pageSize) {
                res.status(400).send('Bad Request! Required Parameters: page and pageSize');
            }
            var page, pageSize;

            try {
                page = parseInt(query.page, 10);
                pageSize = parseInt(query.pageSize, 10);
            } catch (e) {
                res.status(400).send('Bad Request! page and pageSize should be Number');
            }
            if (isNaN(page)) {
                page = 1;
            }
            if (isNaN(pageSize)) {
                pageSize = 50;
            }

            var totalCountSql = 'SELECT COUNT(*) as totalSize';
            var limitSql = 'SELECT _user.name,_user.email,_user.createdTime,_user.updatedTime';
            var joinSql = ' FROM ?? as _user ';

            totalCountSql += joinSql;
            limitSql += joinSql;

            var criteriaSql = ' WHERE _user.name LIKE ? OR _user.email LIKE ?';

            if (query.email) {
                totalCountSql += criteriaSql;
                limitSql += criteriaSql;
            }

            var criteria = '%' + query.email + '%';
            var allCritria = [userTableName, criteria, criteria];

            MService.query(totalCountSql, allCritria,
              function (e, result) {
                  if (e) {
                      res.sendStatus(500);
                      return;
                  }

                  var totalSize = result[0].totalSize;
                  var totalPage = Math.ceil(totalSize / pageSize);


                  if (page > totalPage) {
                      page = totalPage;
                  }

                  if (page < 1) {
                      page = 1;
                  }
                  var startIndex = (page - 1) * pageSize;

                  limitSql += ' GROUP BY _user.updatedTime DESC LIMIT ' + startIndex + ', ' + pageSize;
                  MService.query(limitSql, allCritria, function (err, entity) {
                      if (err) {
                          res.sendStatus(500);
                          return;
                      }
                      res.json(new PaginationResponse(entity, page, pageSize, totalSize));
                  });
              });

        });

        // Get Domain Detail
        app.get('/user/detail/:id', function (req, res) {

            MService.query('SELECT name,email,createdTime,updatedTime FROM ?? WHERE email=?',
                  [userTableName, req.params.id],
                  function (e, entity) {
                      if (e) {
                          res.sendStatus(500);
                          return;
                      }
                      res.json(entity[0] || {});
                  });
        });

        app.put('/user', function (req, res) {
            var body = req.body;

            if (!body.name || !body.email) {
                res.status(400).send('Bad Request! Required Parameters:name, and email');
            }
            var to = global.AppConfig.env.production ? body.email : global.AppConfig.mail.username; // list of receivers
            var url = configHost;

            var password = Password.generate();
            var timestamp = new Date().getTime();
            var entity = {
                name: body.name,
                createdTime: timestamp,
                updatedTime: timestamp,
                email: body.email,
                password: md5(password)
            };

            var newMemberMailOptions = {
                to: to,
                subject: '欢迎加入日志集成管理系统', // Subject line
                // text: '<b>Hello world ?</b>' // html body
                html: '<h3>欢迎加入日志集成管理系统</h3><br/><a href="' + url + '">' + url + '</a>，您的用户名为【<b>' + body.email + '</b>】，密码为<b>' + password + '</b>' // plain text body
            };

            MService.query('INSERT INTO ?? SET ?', [userTableName, entity], function (e) {
                if (e) {
                    if (e.toString().indexOf('Duplicate') !== -1) {
                        res.status(500).send({ errMsg: '用户' + entity.email + '已存在' });
                    } else {
                        res.sendStatus(500);
                    }
                    return;
                }
                Mail.send(newMemberMailOptions);
                delete entity.password;
                res.json(entity);
            });
        });

        app.delete('/domain/:domainId/env/:env/user', function (req, res) {
            var query = req.query;

            if (!query.email) {
                res.status(400).send('Bad Request! Required Parameters: email');
            }

            MService.query('DELETE FROM ?? WHERE userId=?', [envUsersTableName, query.email], function (e) {
                if (e) {
                    res.sendStatus(500);
                    return;
                }
                res.sendStatus(204);
            });

        });

        app.post('/domain/:domainId/env/:env/user', function (req, res) {
            var body = req.body;

            if (!body.name || !body.email || !body.status || !body.userType) {
                res.status(400).send('Bad Request! Required Parameters: userId, name, status, userType and email');
            }

            var entity = {
                name: body.name,
                status: body.status,
                userType: body.userType,
                updatedTime: new Date().getTime()
            };

            MService.query('UPDATE ?? SET ? WHERE userId=? AND envId=?',
              [envUsersTableName, entity, body.email, req.params.env],
              function (e) {
                  if (e) {
                      res.sendStatus(500);
                      return;
                  }
                  res.sendStatus(204);
              });
        });

    }
};
