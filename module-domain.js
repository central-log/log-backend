module.exports = {
	init: function(app){
	/* --------------------Module Domain--------------------------*/
		var pageDomains = {"respCode":"_200","result":[{"id":1,"name":"techops","displayName":"技术运维系统","description":"programer to configure the menu&uri pattern access privileges","url":"https://ops-dev.my.com/techops/"},{"id":2,"name":"crm","displayName":"客户管理系统","description":"customer relation ship management syste","url":"https://crm-dev.my.com/"}]};
		var allDomains = [{
		  id: '1001',
		  name: '权限管理系统',
		  desc: '用来分配权限的子系统',
		  url: 'http://www.baidu.com',
		  alias: 'TechOps',
		  disabled: false
		}, {
		  id: '1002',
		  name: 'BD渠道管理系统',
		  desc: 'BD渠道管理系统',
		  url: 'http://www.sina.com',
		  alias: 'TechOps',
		  disabled: true
		}];

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
		// GET All Domains
		app.get('/common/domains', function (req, res) {
          return res.json(pageDomains);
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
		  console.log(req, req.params.id);
		  var domain = null;
		  for(var i=0, len=allDomains.length;i<len;i++){
		  	if(allDomains[i].id===req.params.id){
		  		domain = allDomains[i];
		  		break;
		  	}
		  }
		  res.json(domain);
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

		// Serach User
		/*
			/menu
			/menu?domain=&disabled=&name=
			/url
			/url?domain=&disabled=&name=
			/user
			/user?name=&email=&phone=&entryTime=&province=&area=&city=&group=&type=&disabled=
			/
		*/
	}
}
