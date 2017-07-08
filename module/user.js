var DAO = require('../service/user');
var MService = require('../service/mysql-base');
var Member = require('../service/member');
var PaginationResponse = require('../entity/PaginationResponse');
var Mail = require('../service/mail');
var Password = require('../service/password');
var md5 = require('md5');
var uuidv1 = require('uuid/v1');
var Utils = require('../utils/Utils');
var userTableName = 'users';
var envUsersTableName = 'env_users';
var configHost = Utils.ensureSlash(global.AppConfig.env.host, true);

module.exports = {
    init: function (app) {
        app.get('/domain/:domainId/env/:env/user', function (req, res) {
            var query = req.query;

            if (!query.page || !query.pageSize) {
                res.status(400).send('Bad Request! Required Parameters: page and pageSize');
            }
            var page = parseInt(query.page, 10);
            var pageSize = parseInt(query.pageSize, 10);

            var totalCountSql = 'SELECT COUNT(*) as totalSize';
            var limitSql = 'SELECT _env_user.*,_env_user.userId as email, _users.name';
            var joinSql = ' FROM ?? as _env_user LEFT JOIN ?? as _users ON _users.email=_env_user.userId';

            totalCountSql += joinSql;
            limitSql += joinSql;

            var criteriaSql = ' WHERE _users.name LIKE ? OR _users.email LIKE ?';

            if (query.email) {
                totalCountSql += criteriaSql;
                limitSql += criteriaSql;
            }
            limitSql += ' GROUP BY _env_user.updatedTime';

            var criteria = '%' + query.email + '%';
            var allCritria = [envUsersTableName, userTableName, criteria, criteria];

            MService.query(totalCountSql, allCritria,
              function (e, result) {
                  if (e) {
                      res.sendStatus(500);
                      return;
                  }
                  MService.query(limitSql, allCritria, function (err, entity) {
                      if (err) {
                          res.sendStatus(500);
                          return;
                      }
                      res.json(new PaginationResponse(entity, page, pageSize, result[0].totalSize));
                  });
              });

        });

        app.put('/domain/:domainId/env/:env/user', function (req, res) {
            var params = req.params;
            var body = req.body;

            if (!body.name || !body.email || !body.status || !body.userType) {
                res.status(400).send('Bad Request! Required Parameters:name, status, userType and email');
            }
            var to = global.AppConfig.env.production ? body.email : global.AppConfig.mail.username; // list of receivers
            var url = (configHost + '#/domain/' + params.domainId);

            var password = Password.generate();
            var entity = {
                name: body.name,
                email: body.email,
                password: password
            };

            function insertEnvUser(connection, response, isNewUser) {
                var timestamp = new Date().getTime();
                var envUserMap = {
                    userId: entity.email,
                    envId: params.env,
                    createdTime: timestamp,
                    updatedTime: timestamp,
                    userType: body.userType,
                    status: body.status
                };

                var newMemberMailOptions = {
                    to: to,
                    subject: '欢迎加入日志集成管理系统', // Subject line
                    // text: '<b>Hello world ?</b>' // html body
                    html: '<h3>欢迎加入日志集成管理系统</h3><br/><a href="' + url + '">' + url + '</a>，您的用户名为【<b>' + body.email + '</b>】，密码为<b>' + password + '</b>' // plain text body
                };
                var addMemberMailOptions = {
                    to: to,
                    subject: '权限更新－日志集成管理系统', // Subject line
                  // text: '<b>Hello world ?</b>' // html body
                    html: '<h3>欢迎加入日志集成管理系统</h3><br/>你可以访问<a href="' + url + '">' + url + '</a>' // plain text body
                };

                connection.query('INSERT INTO ?? SET ?', [envUsersTableName, envUserMap], function (e) {
                    if (e) {
                        connection.rollback(function () {
                            connection.release();
                        });
                        response.sendStatus(500);
                        return;
                    }
                    Mail.send(isNewUser ? newMemberMailOptions : addMemberMailOptions);
                    connection.commit(function (err) {
                        connection.release();
                        if (err) {
                            response.sendStatus(500);
                        }
                        response.sendStatus(204);
                    });
                });
            }
            MService.transaction('INSERT INTO ?? SET ?', [userTableName, entity],
              function (e, connection) {
                  if (e) {
                      if (e.toString().indexOf('Duplicate') !== -1) {
                          insertEnvUser(connection, res, false);
                      } else {
                          connection.release();
                          res.sendStatus(500);
                      }
                      return;
                  }
                  insertEnvUser(connection, res, true);
              });
        });

        app.delete('/domain/:domainId/env/:env/user', function (req, res) {
            var params = req.params;
            var query = req.query;

            if (!params.domainId || !params.env || !query.email) {
                res.status(400).send('Bad Request! Required Parameters: domainId, env and email');
            }

            MService.query('DELETE FROM ?? WHERE ?', [domainEnvTableName, criteria], function (e) {
                if (e) {
                    res.sendStatus(500);
                    return;
                }
                res.sendStatus(204);
            });

            DAO.delete({
                'domainId': params.domainId,
                'env': params.env,
                'email': query.email
            }, function (err) {
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                res.sendStatus(204);
            });
        });

        app.post('/domain/:domainId/env/:env/user', function (req, res) {
            var params = req.params;
            var body = req.body;

            if (!params.domainId || !params.env || !body.name || !body.email || !body.status || !body.userType) {
                res.status(400).send('Bad Request! Required Parameters: domainId, env, userId, name, status, userType and email');
            }

            var criteria = {
                'domainId': params.domainId,
                'env': params.env,
                'email': body.email
            };

            DAO.find(criteria, 1, 1, function (err, docs, totalSize) {
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                if (!totalSize) {
                    res.status(500).send({ errMsg: '用户' + body.email + '不存在' });
                    return;
                }

                DAO.updateOne(criteria, {
                    $set: {
                        name: body.name,
                        lastUpdate: new Date().getTime(),
                        status: body.status,
                        userType: body.userType
                    }
                }, function (e) {
                    if (e) {
                        res.sendStatus(500);
                        return;
                    }
                    res.sendStatus(204);
                });

            });
        });

    }
};
