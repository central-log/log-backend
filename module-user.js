var DAO = require('./service/user');
var InternalErrorResponse = require('./entity/InternalErrorResponse');
var ObjectResponse = require('./entity/ObjectResponse');
var PaginationResponse = require('./entity/PaginationResponse');

module.exports = {
    init: function(app) {
        app.get('/domain/:domainId/env/:env/user', function (req, res) {
          var query = req.query;
          var params = req.params;
          if(!params.domainId || !params.env || !query.page || !query.pageSize){
            res.status(400).send('Bad Request! Required Parameters: domainId, env, page and pageSize');
          }

          var criteria = {};
          if(query.email){
            criteria = {
                  "domainId": params.domainId,
                  "env": params.env,
                  "$or": [
                    { "name": { "$regex": new RegExp(query.email)} },
                    { "email": { "$regex": new RegExp(query.email)} }
                  ]
            };
          }

          var page = parseInt(query.page);
          var pageSize = parseInt(query.pageSize);

          DAO.find(criteria, page, pageSize, function(err, docs, totalSize){
            if(err){
              res.status(500);
              return;
            }
            return res.json(new PaginationResponse(docs, page, pageSize,totalSize));
          });
        });

        app.put('/domain/:domainId/env/:env/user', function(req, res) {
          var params = req.params;
          var body = req.body;
          if(!params.domainId || !params.env || !body.name || !body.email || !body.status || !body.userType){
            res.status(400).send('Bad Request! Required Parameters: domainId, env, name, status, userType and email');
          }

          DAO.find({
              "domainId": params.domainId,
              "env": params.env,
              "email": body.email
          }, 1, 1, function(err, docs, totalSize){
            if(err){
              res.status(500);
              return;
            }
            if(totalSize){
              res.status(500).send({errMsg:'用户'+body.email+'已存在'});
              return;
            }

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
            }
            DAO.add(roleEntity, function(err, result){
              if(err){
                res.status(500);
                return;
              }
              res.sendStatus(204);
            });

          });
        });

        app.delete('/domain/:domainId/env/:env/user', function(req, res) {
          var params = req.params;
          var query = req.query;
          if(!params.domainId || !params.env || !query.email){
            res.status(400).send('Bad Request! Required Parameters: domainId, env and email');
          }

          DAO.delete({
              "domainId": params.domainId,
              "env": params.env,
              "email": query.email
          }, function(err, result){
            if(err){
              res.status(500);
              return;
            }
            res.sendStatus(204);
          });
        });

        app.post('/domain/:domainId/env/:env/user', function(req, res) {
          var params = req.params;
          var body = req.body;
          if(!params.domainId || !params.env || !body.name || !body.email || !body.status || !body.userType){
            res.status(400).send('Bad Request! Required Parameters: domainId, env, userId, name, status, userType and email');
          }

          var criteria = {
              "domainId": params.domainId,
              "env": params.env,
              "email": body.email
          };
          DAO.find(criteria, 1, 1, function(err, docs, totalSize){
            if(err){
              res.status(500);
              return;
            }
            if(!totalSize){
              res.status(500).send({errMsg:'用户'+body.email+'不存在'});
              return;
            }

            DAO.updateOne(criteria,{
    					$set: {
                name: body.name,
                lastUpdate: new Date().getTime(),
                status: body.status,
                userType: body.userType,
              }
    				}, function(err, result){
    					if(err){
    							res.status(500)
    							return;
    					}
    					res.sendStatus(204);
    				});

          });
        });

    }
}
