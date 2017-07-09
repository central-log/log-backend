var MService = require('../service/mysql-base');
var PaginationResponse = require('../entity/PaginationResponse');
var roleTableName = 'roles';
var uuidv1 = require('uuid/v1');

module.exports = {
    init: function (app) {
        app.get('/role', function (req, res) {
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
            var allCritria = [roleTableName, criteria, criteria];

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
        app.get('/role/detail/:id', function (req, res) {

            MService.query('SELECT * FROM ?? WHERE id=?',
                  [roleTableName, req.params.id],
                  function (e, entity) {
                      if (e) {
                          res.status(500).send(e);
                          return;
                      }
                      res.json(entity[0] || {});
                  });
        });

        app.put('/role', function (req, res) {
            var body = req.body;

            if (!body.name || !body.description || !body.enabled) {
                res.status(400).send('Bad Request! Required Parameters: name, description, enabled');
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

            MService.query('INSERT INTO ?? SET ?', [roleTableName, entity], function (e) {
                if (e) {
                    if (e.toString().indexOf('Duplicate') !== -1) {
                        res.status(500).send({ errMsg: '用户' + entity.email + '已存在' });
                    } else {
                        res.status(500).send(e);
                    }
                    return;
                }
                res.json(entity);
            });
        });

        app.delete('/role/detail/:id', function (req, res) {
            var params = req.params;

            MService.query('DELETE FROM ?? WHERE id=?', [roleTableName, params.email], function (e) {
                if (e) {
                    res.status(500).send(e);
                    return;
                }
                res.sendStatus(204);
            });

        });

        app.post('/role/detail/:id', function (req, res) {
            var body = req.body;

            if (!body.name || !body.description || !body.enabled) {
                res.status(400).send('Bad Request! Required Parameters: name, description, enabled');
            }

            var entity = {
                name: body.name,
                description: body.description,
                enabled: body.enabled,
                updatedTime: new Date().getTime()
            };

            MService.query('UPDATE ?? SET ? WHERE id=?',
              [roleTableName, entity, req.params.id],
              function (e) {
                  if (e) {
                      res.status(400).send(e);
                      return;
                  }
                  res.sendStatus(204);
              });
        });

    }
};
