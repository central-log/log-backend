var DAO = require('./service/domain');
var InternalErrorResponse = require('./entity/InternalErrorResponse');
var ObjectResponse = require('./entity/ObjectResponse');
var PaginationResponse = require('./entity/PaginationResponse');
var ObjectId = require('mongodb').ObjectId;

module.exports = {
	init: function(app){
		var allMenus = [{
			id:'1001',
			domain:'TechOps',
			parent: '1003',
			name: '菜单',
			url: 'http://www.baidu.com/',
			desc: 'This is Description'
		},{
			id:'1002',
			domain:'TechOps',
			parent: '1004',
			name: '菜单22',
			url: 'http://www.baidu.com/',
			desc: 'This is Description'
		}];

		var allURLs = [{
			id:'1001',
			domain:'TechOps',
			name: '菜单',
			mode: 'http://www.baidu.com/\d',
			desc: 'This is Description'
		},{
			id:'1002',
			domain:'TechOps',
			name: '菜单2',
			mode: 'http://www.baidu.com/*',
			desc: 'This is Description'
		}];

		var domainUsers = [{
	      id: '1001',
	      name: '胡本绿',
	      email: 'benlv.hu@my.com',
	      phone: '1828401118',
	      group: 'TechOps',
	      area: '上海',
	      entryTime: '2015/10/12'
	    }, {
	      id: '1002',
	      name: '王昊天',
	      email: 'haotian.wang@my.com',
	      phone: '1828401118',
	      group: 'TechOps',
	      area: '上海',
	      entryTime: '2015/10/12'
	    }, {
	      id: '1002',
	      name: '陆勇舟',
	      email: 'yongzhou.lu@my.com',
	      phone: '1828401118',
	      group: 'TechOps',
	      area: '上海',
	      entryTime: '2015/10/12'
	    }];
		// 查询Domain列表
		app.get('/domain', function (req, res) {
			var params = req.query;
			if(!params.page || !params.pageSize){
				res.status(400).send('Bad Request! Required Parameters: page and pageSize');
			}

			var criteria = {};
			if(params.name){
				criteria = { "$or": [
				    { "name": { "$regex": new RegExp(params.name)} },
				    { "description": { "$regex": new RegExp(params.name) }},
				    { "email": { "$regex": new RegExp(params.name) }}
				]};
			}

			DAO.find(criteria, params.page, params.pageSize, function(err, docs, totalSize){
				if(err){
					res.json(new InternalErrorResponse());
					return;
				}
				return res.json(new PaginationResponse(docs, params.page, params.pageSize,totalSize));
			});
    });
		// 接入Domain
		app.put('/domain', function (req, res) {

			if(!req.body.name
				|| !req.body.email
				|| !req.body.description
				|| !req.body.endDateTime
				|| !req.body.starDateTime){
				res.status(400).send('Bad Request! Required Parameters: name, email, endDateTime, starDateTime, description');
				return;
			}

			var timestamp = new Date().getTime();
			var entity = {
				name: req.body.name,
				description: req.body.description,
				email: req.body.email,
				email: req.body.email,
				endDateTime: req.body.endDateTime,
				starDateTime: req.body.starDateTime,
				createdTime: timestamp,
				updatedTime: timestamp,
				enabled: true
			}
			DAO.add(entity, function(err, result){
				if(err){
					res.json(new InternalErrorResponse());
					return;
				}
				res.json(new ObjectResponse(entity));
			});
    });

        app.get('/common/groupTypes', function (req, res) {
          var start = new Date().getTime();

          //return res.sendStatus(400);
		  return res.json({
              "respCode": "_200",
              "result": {
                "RISK": "风控",
                "ADMINISTRATOR": "管理员",
                "CUSTOMER_SERVICE": "客服",
                "SALES": "销售"
              }
            });
		});
		// Get Domain Detail
		app.get('/domain/:id', function (req, res) {
			DAO.findById(req.params.id, function(err, doc){
				if(err){
						res.json(new InternalErrorResponse());
						return;
				}
				res.json(new ObjectResponse(doc?doc:null));
			});
		});

		// userIds seperated by comma
		app.post('/domain/:domainId/env', function (req, res) {

			if(!req.body.name
				|| !req.body.email
				|| !req.body.description
				|| !req.body.logLevel
				|| !req.body.domainId){
				res.status(400).send('Bad Request! Required Parameters: name, email, description, logLevel, domainId');
				return;
			}

			var domainId = req.body.domainId;
			var entity = {
				name: req.body.name,
				email: req.body.email,
				description: req.body.description,
				logLevel: req.body.logLevel
			};

			DAO.findById(domainId, function(err, doc){
				if(err){
						res.json(new InternalErrorResponse());
						return;
				}
				var isAlreadyExists = false;
				if(doc.env){
					isAlreadyExists = doc.env.some(function(env){
						return env.name.toLowerCase() === entity.name.toLowerCase();
					})
				}
				if(isAlreadyExists){
					res.json(new InternalErrorResponse('添加失败：部署环境'+entity.name + '已存在'));
					return;
				}
				DAO.updateOne({
					_id: new ObjectId(domainId)
				},{
					$set: { env : doc.env?doc.env.concat(entity):[entity] }
				}, function(err, result){
					if(err){
							res.json(new InternalErrorResponse());
							return;
					}
					res.sendStatus(204);
				});
			});

		});

		// userIds seperated by comma
		app.put('/domain/:domainId/user', function (req, res) {
			// /domain/:domainId/user?userIds=1,2,3
			res.sendStatus(204);
		});

		// Remove User Binding form domain
		app.delete('/domain/:domainId/user/:userId', function (req, res) {
			res.sendStatus(204);
		});

		// Get all menus of domain
		app.get('/domain/:domainId/menu', function (req, res) {
			res.json(allMenus);
		});
		// Get all menus of domain
		app.get('/domain/:domainId/url', function (req, res) {
			res.json(allURLs);
		});
	}
}
