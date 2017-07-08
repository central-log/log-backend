var MService = require('../service/mysql-base');
var PaginationResponse = require('../entity/PaginationResponse');
var uuidv1 = require('uuid/v1');
var domainTableName = 'domain';
var domainEnvTableName = 'domain_env';

module.exports = {
    init: function (app) {

		// 查询Domain列表
        app.get('/domain', function (req, res) {
            var params = req.query;

            if (!params.page || !params.pageSize) {
                res.status(400).send('Bad Request! Required Parameters: page and pageSize');
            }

            var totalCountSql = 'SELECT COUNT(*) as totalSize  FROM ??';
            var limitSql = 'SELECT * FROM ??';
            var criteriaSql;

            var page = parseInt(params.page, 10);
            var pageSize = parseInt(params.pageSize, 10);

            if (params.name) {
                criteriaSql = 'WHERE name LIKE ? OR description LIKE ? OR email LIKE ?';
                totalCountSql += criteriaSql;
                limitSql += criteriaSql;
            }
            limitSql += ' GROUP BY updatedTime DESC';
            var criteria = '%' + params.name + '%';

            MService.query(totalCountSql,
              [domainTableName, criteria, criteria, criteria],
              function (e, result) {
                  if (e) {
                      res.sendStatus(500);
                      return;
                  }
                  MService.query(limitSql,
                    [domainTableName, criteria, criteria, criteria],
                    function (err, entity) {
                        if (err) {
                            res.sendStatus(500);
                            return;
                        }
                        res.json(new PaginationResponse(entity, page, pageSize, result[0].totalSize));
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
                endDateTime: req.body.endDateTime,
                starDateTime: req.body.starDateTime,
                createdTime: timestamp,
                updatedTime: timestamp,
                enabled: true
            };

            MService.query('INSERT INTO ?? SET ?', [domainTableName, entity], function (e) {
                if (e) {
                    if (e.toString().indexOf('Duplicate') !== -1) {
                        res.status(500).send({ errMsg: req.body.name + '已存在' });
                    } else {
                        res.sendStatus(500);
                    }
                    return;
                }
                res.json(entity);
            });
        });

		// Get Domain Detail
        app.get('/domain/:id', function (req, res) {

            MService.query('SELECT domain.*, domain_env.id as _id, domain_env.logLevel as _logLevel, domain_env.name as _name, domain_env.email as _email, domain_env.description as _description FROM ?? LEFT JOIN domain_env ON domain_env.domainId=domain.id WHERE ' + domainTableName + '.id = ? ORDER BY domain_env.updatedTime DESC',
              [domainTableName, req.params.id],
              function (e, entity) {
                  if (e) {
                      res.sendStatus(500);
                      return;
                  }
                  if (entity[0]._id) {
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
                        res.sendStatus(500);
                    }
                    return;
                }
                res.sendStatus(204);
            });
        });
		// 删除部署环境
        app.delete('/domain/:domainId/env/:envId', function (req, res) {
            var params = req.params;

            if (!params.domainId || !params.envId) {
                res.status(400).send('Bad Request! Required Parameters: domainId, envId');
            }
            var criteria = {
                id: params.envId
            };

            MService.query('DELETE FROM ?? WHERE ?', [domainEnvTableName, criteria], function (e) {
                if (e) {
                    res.sendStatus(500);
                    return;
                }
                res.sendStatus(204);
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

            MService.query('UPDATE ?? SET ? WHERE id=?', [domainEnvTableName, entity, req.params.envId], function (e) {
                if (e) {
                    if (e.toString().indexOf('Duplicate') !== -1) {
                        res.status(500).send({ errMsg: '部署环境' + entity.name + '已存在' });
                    } else {
                        res.sendStatus(500);
                    }

                    return;
                }
                res.sendStatus(204);
            });

        });
    }
};
