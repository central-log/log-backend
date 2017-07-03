var DAO = require('../service/domain');
var PaginationResponse = require('../entity/PaginationResponse');
var ObjectId = require('mongodb').ObjectId;
var uuidv1 = require('uuid/v1');

module.exports = {
    init: function (app) {

		// 查询Domain列表
        app.get('/domain', function (req, res) {
            var params = req.query;

            if (!params.page || !params.pageSize) {
                res.status(400).send('Bad Request! Required Parameters: page and pageSize');
            }

            var criteria = {};

            if (params.name) {
                criteria = { '$or': [
											{ 'name': { '$regex': new RegExp(params.name) } },
											{ 'description': { '$regex': new RegExp(params.name) } },
											{ 'email': { '$regex': new RegExp(params.name) } }
                ] };
            }

            DAO.find(criteria, params.page, params.pageSize, function (err, docs, totalSize) {
                if (err) {
                    res.status(500);
                    return;
                }
                return res.json(new PaginationResponse(docs, params.page, params.pageSize, totalSize));
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

            DAO.find({
                'name': req.body.name
            }, 1, 1, function (err, docs, totalSize) {
                if (err) {
                    res.status(500);
                    return;
                }
                if (totalSize) {
                    res.status(500).send({ errMsg: req.body.name + '已存在' });
                    return;
                }

                var timestamp = new Date().getTime();
                var entity = {
                    name: req.body.name,
                    description: req.body.description,
                    email: req.body.email,
                    endDateTime: req.body.endDateTime,
                    starDateTime: req.body.starDateTime,
                    createdTime: timestamp,
                    updatedTime: timestamp,
                    enabled: true
                };

                DAO.add(entity, function (e) {
                    if (e) {
                        res.status(500);
                        return;
                    }
                    res.json(entity);
                });

            });
        });

		// Get Domain Detail
        app.get('/domain/:id', function (req, res) {
            DAO.findById(req.params.id, function (err, doc) {
                if (err) {
                    res.status(500);
                    return;
                }
                res.json(doc ? doc : {});
            });
        });

		// 添加部署环境
        app.put('/domain/:domainId/env', function (req, res) {

            if (!req.body.name
				|| !req.body.email
				|| !req.body.description
				|| !req.body.logLevel
				|| !req.body.domainId) {
                res.status(400).send('Bad Request! Required Parameters: name, email, description, logLevel, domainId');
                return;
            }

            var domainId = req.body.domainId;
            var entity = {
                id: uuidv1(),
                name: req.body.name,
                email: req.body.email,
                description: req.body.description,
                logLevel: req.body.logLevel
            };

            DAO.findById(domainId, function (err, doc) {
                if (err) {
                    res.status(500);
                    return;
                }
                var isAlreadyExists = false;

                if (doc.env) {
                    isAlreadyExists = doc.env.some(function (env) {
                        return env.name.toLowerCase() === entity.name.toLowerCase();
                    });
                }
                if (isAlreadyExists) {
                    res.status(500).send({ errMsg: '添加失败：部署环境' + entity.name + '已存在' });
                    return;
                }
                DAO.updateOne({
                    _id: new ObjectId(domainId)
                }, {
                    $set: { env: doc.env ? doc.env.concat(entity) : [entity] }
                }, function (e) {
                    if (e) {
                        res.status(500);
                        return;
                    }
                    res.sendStatus(204);
                });
            });

        });
		// 删除部署环境
        app.delete('/domain/:domainId/env/:envId', function (req, res) {
            var params = req.params;

            if (!params.domainId || !params.envId) {
                res.status(400).send('Bad Request! Required Parameters: domainId, envId');
            }

            DAO.findById(params.domainId, function (err, doc) {
                if (err) {
                    res.status(500);
                    return;
                }
                var currentEnv, currentIndex;

                if (doc.env) {
                    currentEnv = doc.env.find(function (env, index) {
                        currentIndex = index;
                        return env.id.toLowerCase() === params.envId.toLowerCase();
                    });
                }
                if (!currentEnv) {
                    res.status(204);
                    return;
                }

                doc.env.splice(currentIndex, 1);

                DAO.updateOne({
                    _id: new ObjectId(params.domainId)
                }, {
                    $set: { env: doc.env }
                }, function (e) {
                    if (e) {
                        res.status(500);
                        return;
                    }
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

            var domainId = req.params.domainId;
            var envId = req.params.envId;

            DAO.findById(domainId, function (err, doc) {
                if (err) {
                    res.status(500);
                    return;
                }
                var currentEnv;

                if (doc.env) {
                    currentEnv = doc.env.find(function (env) {
                        return env.id.toLowerCase() === envId.toLowerCase();
                    });
                }
                if (!currentEnv) {
                    res.status(500).send({ errMsg: '修改失败：部署环境' + req.body.name + '不存在，已被删除！' });
                    return;
                }
                currentEnv.name = req.body.name;
                currentEnv.email = req.body.email;
                currentEnv.description = req.body.description;
                currentEnv.logLevel = req.body.logLevel;

                DAO.updateOne({
                    _id: new ObjectId(domainId)
                }, {
                    $set: { env: doc.env }
                }, function (e) {
                    if (e) {
                        res.status(500);
                        return;
                    }
                    res.sendStatus(204);
                });
            });

        });
    }
};
