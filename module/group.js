var MService = require('../service/mysql-base');
var PaginationResponse = require('../entity/PaginationResponse');
var tableName = 'groups';
var uuidv1 = require('uuid/v1');

module.exports = {
    init: function (app) {
        app.get('/group', function (req, res) {
            var query = req.query;

            if (!query.page || !query.pageSize) {
                res.status(400).send('Bad Request! Required Parameters: page and pageSize');
                return;
            }
            var page, pageSize;

            try {
                page = parseInt(query.page, 10);
                pageSize = parseInt(query.pageSize, 10);
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

            var totalCountSql = 'SELECT COUNT(*) as totalSize';
            var limitSql = 'SELECT *';
            var joinSql = ' FROM ?? ';

            totalCountSql += joinSql;
            limitSql += joinSql;

            var criteriaSql = ' WHERE name LIKE ? OR description LIKE ?';

            if (query.name) {
                totalCountSql += criteriaSql;
                limitSql += criteriaSql;
            }

            var criteria = '%' + query.name + '%';
            var allCritria = [tableName, criteria, criteria];

            MService.query(totalCountSql, allCritria,
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
                  MService.query(limitSql, allCritria, function (err, entity) {
                      if (err) {
                          res.status(500).send(err);
                          return;
                      }
                      res.json(new PaginationResponse(entity, page, pageSize, totalSize));
                  });
              });

        });

        // Get Domain Detail
        app.get('/group/detail/:id', function (req, res) {

            MService.query('SELECT * FROM ?? WHERE id=?',
                  [tableName, req.params.id],
                  function (e, entity) {
                      if (e) {
                          res.status(500).send(e);
                          return;
                      }
                      res.json(entity[0] || {});
                  });
        });
        app.delete('/group/role/:id/:roleId', function (req, res) {

            MService.query('DELETE FROM role_group WHERE groupId=? AND roleId=?',
              [req.params.id, req.params.roleId], function (e) {
                  if (e) {
                      res.status(500).send(e);
                      return;
                  }
                  res.sendStatus(204);
              });
        });

        app.delete('/group/user/:id/:userId', function (req, res) {

            MService.query('DELETE FROM user_group WHERE groupId=? AND userId=?',
              [req.params.id, req.params.userId], function (e) {
                  if (e) {
                      res.status(500).send(e);
                      return;
                  }
                  res.sendStatus(204);
              });
        });

        app.get('/group/role/:id', function (req, res) {

            var limitSql = 'SELECT roles.*, role_group.updatedTime FROM role_group LEFT JOIN roles ON roles.id=role_group.roleId WHERE role_group.groupId=? ORDER BY role_group.updatedTime';

            MService.query(limitSql, [req.params.id],
                  function (e, entity) {
                      if (e) {
                          res.status(500).send(e);
                          return;
                      }
                      res.json(entity || {});
                  });
        });

        app.get('/group/user/:id', function (req, res) {

            var limitSql = 'SELECT users.*, user_group.updatedTime FROM user_group LEFT JOIN users ON users.email=user_group.userId WHERE user_group.groupId=? ORDER BY user_group.updatedTime';

            MService.query(limitSql, [req.params.id],
                  function (e, entity) {
                      if (e) {
                          res.status(500).send(e);
                          return;
                      }
                      res.json(entity || {});
                  });
        });

        app.put('/group/role/:id/:roleId', function (req, res) {

            var entity = {
                groupId: req.params.id,
                roleId: req.params.roleId,
                updatedTime: new Date().getTime()
            };

            MService.query('INSERT INTO role_group SET ?', entity,
                  function (e) {
                      if (e) {
                          if (e.toString().indexOf('Duplicate') !== -1) {
                              res.sendStatus(204);
                          } else {
                              res.status(500).send(e);
                          }
                          return;
                      }
                      res.sendStatus(204);
                  });
        });

        app.put('/group/user/:id/:userId', function (req, res) {

            var entity = {
                groupId: req.params.id,
                userId: req.params.userId,
                updatedTime: new Date().getTime()
            };

            MService.query('INSERT INTO user_group SET ?', entity,
                  function (e) {
                      if (e) {
                          if (e.toString().indexOf('Duplicate') !== -1) {
                              res.sendStatus(204);
                          } else {
                              res.status(500).send(e);
                          }
                          return;
                      }
                      res.sendStatus(204);
                  });
        });

        app.put('/group', function (req, res) {
            var body = req.body;

            if (!body.name || !body.description || !('enabled' in body)) {
                res.status(400).send('Bad Request! Required Parameters: name, description, enabled');
                return;
            }
            var timestamp = new Date().getTime();
            var entity = {
                id: uuidv1(),
                name: body.name,
                description: body.description,
                enabled: body.enabled,
                createdTime: timestamp,
                updatedTime: timestamp
            };

            MService.query('INSERT INTO ?? SET ?', [tableName, entity], function (e) {
                if (e) {
                    if (e.toString().indexOf('Duplicate') !== -1) {
                        res.status(500).send({ errMsg: '组' + entity.name + '已存在' });
                    } else {
                        res.status(500).send(e);
                    }
                    return;
                }
                res.json(entity);
            });
        });

        app.delete('/group/detail/:id', function (req, res) {
            var params = req.params;

            MService.query('DELETE FROM ?? WHERE id=?', [tableName, params.id], function (e) {
                if (e) {
                    res.status(500).send(e);
                    return;
                }
                res.sendStatus(204);
            });

        });

        app.post('/group/detail/:id', function (req, res) {
            var body = req.body;

            if (!body.name || !body.description || !('enabled' in body)) {
                res.status(400).send('Bad Request! Required Parameters: name, description, enabled');
                return;
            }

            var entity = {
                name: body.name,
                description: body.description,
                enabled: body.enabled,
                updatedTime: new Date().getTime()
            };

            MService.query('UPDATE ?? SET ? WHERE id=?',
              [tableName, entity, req.params.id],
              function (e) {
                  if (e) {
                      if (e.toString().indexOf('Duplicate') !== -1) {
                          res.status(500).send({ errMsg: '组' + entity.name + '已存在' });
                      } else {
                          res.status(500).send(e);
                      }
                      return;
                  }
                  entity.id = req.params.id;
                  res.json(entity);
              });
        });

    }
};
