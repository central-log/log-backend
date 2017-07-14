var MService = require('../service/mysql-base');
var PaginationResponse = require('../entity/PaginationResponse');
var uuidv1 = require('uuid/v1');
var domainTableName = 'domain';
var Password = require('../service/password');
var Mail = require('../service/mail');
var userTableName = 'users';
var domainEnvTableName = 'domain_env';
var md5 = require('md5');
var Utils = require('../utils/Utils');
var configHost = Utils.ensureSlash(global.AppConfig.env.host, true);

module.exports = {
    init: function (app) {

		// 查询Domain列表
        app.get('/domain', function (req, res) {
            var params = req.query;

            if (!params.page || !params.pageSize) {
                res.status(400).send('Bad Request! Required Parameters: page and pageSize');
                return;
            }
            var page, pageSize;

            try {
                page = parseInt(params.page, 10);
                pageSize = parseInt(params.pageSize, 10);
            } catch (e) {
                res.status(400).send('Bad Request! page and pageSize should be Number');
                return;
            }
            if (isNaN(page)) {
                page = 1;
            }
            if (isNaN(pageSize)) {
                pageSize = 50;
            }

            var totalCountSql = 'SELECT COUNT(*) as totalSize  FROM ?? ';
            var limitSql = 'SELECT * FROM ?? ';
            var criteriaSql;

            if (params.name) {
                criteriaSql = 'WHERE name LIKE ? OR description LIKE ? OR email LIKE ?';
                totalCountSql += criteriaSql;
                limitSql += criteriaSql;
            }

            var criteria = '%' + params.name + '%';

            MService.query(totalCountSql,
              [domainTableName, criteria, criteria, criteria],
              function (e, result) {
                  if (e) {
                      res.status(500).send(e);
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

                  limitSql += ' GROUP BY updatedTime DESC LIMIT ' + startIndex + ', ' + pageSize;
                  MService.query(limitSql,
                    [domainTableName, criteria, criteria, criteria],
                    function (err, entity) {
                        if (err) {
                            res.status(500).send(err);
                            return;
                        }
                        res.json(new PaginationResponse(entity, page, pageSize, totalSize));
                    });
              });

        });
		// 接入Domain
        app.put('/domain', function (req, res) {

            if (!req.body.name
				|| !req.body.email
				|| !req.body.description
				|| !req.body.endDateTime
				|| !req.body.starDateTime) {
                res.status(400).send('Bad Request! Required Parameters: name, email, endDateTime, starDateTime, description');
                return;
            }

            var timestamp = new Date().getTime();
            var entity = {
                id: uuidv1(),
                name: req.body.name,
                description: req.body.description,
                email: req.body.email,
                secret: md5(uuidv1()),
                endDateTime: req.body.endDateTime,
                starDateTime: req.body.starDateTime,
                createdTime: timestamp,
                updatedTime: timestamp,
                enabled: true
            };

            function insertUser(connection) {
                var password = Password.generate();
                var userEntity = {
                    name: entity.email,
                    createdTime: timestamp,
                    updatedTime: timestamp,
                    email: entity.email,
                    password: md5(password)
                };

                connection.query('INSERT INTO ?? SET ?', [userTableName, userEntity], function (e) {
                    var isUserNotExists = true;

                    if (e) {
                        if (e.toString().indexOf('Duplicate') === -1) {
                            connection.rollback(function () {
                                connection.release();
                            });
                            res.status(500).send(e);
                            return;
                        } else {
                            isUserNotExists = false;
                        }
                    }
                    var to = global.AppConfig.env.production ? entity.email : global.AppConfig.mail.username; // list of receivers
                    var url = (configHost + '#/domain/' + entity.id);

                    var newDomainMailOptions = {
                        to: to,
                        subject: '欢迎加入日志集成管理系统', // Subject line
                        // text: '<b>Hello world ?</b>' // html body
                        html: '<h3>欢迎加入日志集成管理系统</h3><br/><a href="' + url + '">' + url + '</a>，您的用户名为【<b>' + entity.email + '</b>】，密码为<b>' + password + '</b>' // plain text body
                    };
                    var addMemberMailOptions = {
                        to: to,
                        subject: '对接系统添加成功－日志集成管理系统', // Subject line
                      // text: '<b>Hello world ?</b>' // html body
                        html: '<h3>添加对接系统' + req.body.name + '成功！日志集成管理系统</h3><br/>你可以访问<a href="' + url + '">' + url + '</a>' // plain text body
                    };

                    connection.commit(function (err) {
                        connection.release();
                        if (err) {
                            res.status(500).send(err);
                            return;
                        }
                        if (isUserNotExists) {
                            Mail.send(addMemberMailOptions);
                        }
                        global.redisClient.set(entity.id, entity.enabled);
                        global.redisClient.set(entity.id + '.endDateTime', entity.endDateTime);
                        Mail.send(newDomainMailOptions);
                        res.sendStatus(204);
                    });
                });
            }
            MService.transaction('INSERT INTO ?? SET ?', [domainTableName, entity],
              function (e, connection) {
                  if (e) {
                      connection.release();
                      if (e.toString().indexOf('Duplicate') !== -1) {
                          res.status(500).send({ errMsg: req.body.name + '已存在' });
                      } else {
                          res.status(500).send(e);
                      }
                      return;
                  }
                  insertUser(connection);
              });
        });

		// Get Domain Detail
        app.get('/domain/:id', function (req, res) {

            MService.query('SELECT domain.*, domain_env.id as _id, domain_env.logLevel as _logLevel, domain_env.name as _name, domain_env.email as _email, domain_env.description as _description FROM ?? LEFT JOIN domain_env ON domain_env.domainId=domain.id WHERE ' + domainTableName + '.id = ? ORDER BY domain_env.updatedTime DESC',
              [domainTableName, req.params.id],
              function (e, entity) {
                  if (e) {
                      res.status(500).send(e);
                      return;
                  }
                  if (entity[0] && entity[0]._id) {
                      entity[0].env = entity.map(function (row) {
                          return {
                              id: row._id,
                              name: row._name,
                              email: row._email,
                              description: row._description,
                              logLevel: row._logLevel
                          };
                      });
                  }
                  res.json(entity[0] || {});
              });
        });

		// 添加部署环境
        app.put('/domain/:domainId/env', function (req, res) {

            if (!req.body.name
				|| !req.body.email
				|| !req.body.description
				|| !req.body.logLevel
				|| !req.params.domainId) {
                res.status(400).send('Bad Request! Required Parameters: name, email, description, logLevel, domainId');
                return;
            }
            var timestamp = new Date().getTime();
            var entity = {
                id: uuidv1(),
                name: req.body.name,
                email: req.body.email,
                description: req.body.description,
                logLevel: req.body.logLevel,
                domainId: req.params.domainId,
                createdTime: timestamp,
                updatedTime: timestamp
            };

            MService.query('INSERT INTO ?? SET ?', [domainEnvTableName, entity], function (e) {
                if (e) {
                    if (e.toString().indexOf('Duplicate') !== -1) {
                        res.status(500).send({ errMsg: '部署环境' + entity.name + '已存在' });
                    } else {
                        res.status(500).send(e);
                    }
                    return;
                }
                global.redisClient.set(entity.domainId + '.' + entity.name + '.logLevel', entity.logLevel);
                global.redisClient.set(entity.domainId + '.' + entity.name + '.email', entity.email);
                global.redisClient.set(entity.domainId + '.' + entity.name + '.active', global.ENV_ACTIVE);
                res.sendStatus(204);
            });
        });
		// 删除部署环境
        app.delete('/domain/:domainId/env/:envId', function (req, res) {
            var params = req.params;

            if (!params.domainId || !params.envId) {
                res.status(400).send('Bad Request! Required Parameters: domainId, envId');
                return;
            }
            var criteria = {
                id: params.envId
            };

            MService.query('SELECT name FROM domain_env WHERE id=?', [params.envId], function (e) {
                if (e, res) {
                    res.status(500).send(e);
                    return;
                }
                if (!res[0]) {
                    return res.sendStatus(204);
                }

                var beforeName = res[0];

                MService.query('DELETE FROM ?? WHERE ?', [domainEnvTableName, criteria], function (err) {
                    if (err) {
                        res.status(500).send(err);
                        return;
                    }
                    global.redisClient.set(params.domainId + '.' + beforeName + '.active', global.ENV_DISABLE);
                    res.sendStatus(204);
                });
            });

        });
		// 修改部署环境
        app.post('/domain/:domainId/env/:envId', function (req, res) {

            if (!req.body.name
				|| !req.body.email
				|| !req.body.description
				|| !req.body.logLevel
				|| !req.params.envId) {
                res.status(400).send('Bad Request! Required Parameters: name, email, description, logLevel');
                return;
            }
            var entity = {
                email: req.body.email,
                name: req.body.name,
                description: req.body.description,
                logLevel: req.body.logLevel,
                updatedTime: new Date().getTime()
            };

            MService.query('SELECT name FROM domain_env WHERE id=?', [req.params.envId], function (e) {
                if (e, res) {
                    res.status(500).send(e);
                    return;
                }
                if (!res[0]) {
                    return res.status(500).send({ errMsg: '部署环境' + entity.name + '不存在' });
                }

                var beforeName = res[0];

                MService.query('UPDATE ?? SET ? WHERE id=?', [domainEnvTableName, entity, req.params.envId], function (err) {
                    if (err) {
                        if (err.toString().indexOf('Duplicate') !== -1) {
                            res.status(500).send({ errMsg: '部署环境' + entity.name + '已存在' });
                        } else {
                            res.status(500).send(err);
                        }
                        return;
                    }
                    global.redisClient.set(req.params.domainId + '.' + entity.name + '.logLevel', entity.logLevel);
                    global.redisClient.set(req.params.domainId + '.' + entity.name + '.email', entity.email);
                    global.redisClient.set(req.params.domainId + '.' + entity.name + '.active', global.ENV_ACTIVE);

                    if (beforeName !== entity.name) {
                        global.redisClient.set(req.params.domainId + '.' + beforeName + '.active', global.ENV_DISABLE);
                    }

                    res.sendStatus(204);
                });

            });
        });
    }
};
