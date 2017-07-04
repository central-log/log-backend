var DAO = require('../service/user');
var Member = require('../service/member');
var PaginationResponse = require('../entity/PaginationResponse');
var Mail = require('../service/mail');
var Password = require('../service/password');
var md5 = require('md5');
var Utils = require('../utils/Utils');

module.exports = {
    init: function (app) {
        app.get('/domain/:domainId/env/:env/user', function (req, res) {
            var query = req.query;
            var params = req.params;

            if (!params.domainId || !params.env || !query.page || !query.pageSize) {
                res.status(400).send('Bad Request! Required Parameters: domainId, env, page and pageSize');
            }

            var criteria = {
                'domainId': params.domainId,
                'env': params.env
            };

            if (query.email) {
                criteria.$or = [
              { 'name': { '$regex': new RegExp(query.email) } },
              { 'email': { '$regex': new RegExp(query.email) } }
                ];
            }
            var page = parseInt(query.page, 10);
            var pageSize = parseInt(query.pageSize, 10);

            DAO.find(criteria, page, pageSize, function (err, docs, totalSize) {
                if (err) {
                    res.status(500);
                    return;
                }
                return res.json(new PaginationResponse(docs, page, pageSize, totalSize));
            });
        });

        app.put('/domain/:domainId/env/:env/user', function (req, res) {
            var params = req.params;
            var body = req.body;

            if (!params.domainId || !params.env || !body.name || !body.email || !body.status || !body.userType) {
                res.status(400).send('Bad Request! Required Parameters: domainId, env, name, status, userType and email');
            }

            DAO.find({
                'domainId': params.domainId,
                'env': params.env,
                'email': body.email
            }, 1, 1, function (err, docs, totalSize) {
                if (err) {
                    res.status(500);
                    return;
                }
                if (totalSize) {
                    res.status(500).send({ errMsg: '用户' + body.email + '已存在' });
                    return;
                }
                var password = Password.generate();
                var to = global.AppConfig.env.production ? body.email : global.AppConfig.mail.username; // list of receivers
                var url = (Utils.ensureSlash(global.AppConfig.env.host, true) + '#/domain/' + params.domainId);
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
                var timestamp = new Date().getTime();
                var roleEntity = {
                    name: body.name,
                    email: body.email,
                    createDate: timestamp,
                    lastUpdate: timestamp,
                    status: body.status,
                    userType: body.userType,
                    domainId: params.domainId,
                    env: params.env
                };

                DAO.add(roleEntity, function (e) {
                    if (e) {
                        res.status(500);
                        return;
                    }

                    Member.find({
                        'email': body.email
                    }, 1, 1, function (_err, _docs, _totalSize) {
                        if (_err) {
                            res.status(500);
                            return;
                        }
                        if (_totalSize) {
                            Mail.send(addMemberMailOptions);
                            res.sendStatus(204);
                            return;
                        }
                        Mail.send(newMemberMailOptions);
                        Member.add({
                            email: body.email,
                            password: md5(password)
                        }, function (error) {
                            if (error) {
                                res.status(500);
                                return;
                            }
                            res.sendStatus(204);
                        });
                    });

                });

            });
        });

        app.delete('/domain/:domainId/env/:env/user', function (req, res) {
            var params = req.params;
            var query = req.query;

            if (!params.domainId || !params.env || !query.email) {
                res.status(400).send('Bad Request! Required Parameters: domainId, env and email');
            }

            DAO.delete({
                'domainId': params.domainId,
                'env': params.env,
                'email': query.email
            }, function (err) {
                if (err) {
                    res.status(500);
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
                    res.status(500);
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
                        res.status(500);
                        return;
                    }
                    res.sendStatus(204);
                });

            });
        });

    }
};
