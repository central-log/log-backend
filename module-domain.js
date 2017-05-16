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
		app.post('/user/query', function (req, res) {
			var result = {"respCode":"_200","result":{"page":1,"pageSize":50,"totalCount":26,"data":[{"id":16,"name":"gy1","email":"gy1@my.com","phone":"18817333551","enabled":true,"createDate":1448434746000,"province":"上海市","city":"上海市","district":"浦东新区","groupName":"y1","roleType":"LEADER"},{"id":42,"name":"gy10@my.com","email":"gy10@my.com","phone":"13322221122","enabled":true,"createDate":1448957867000,"province":"上海市","city":"上海市","district":"浦东新区","groupName":"1122222","roleType":"LEADER"},{"id":17,"name":"gy2","email":"gy2@my.com","phone":"18817333552","enabled":true,"createDate":1448434794000,"province":"上海市","city":"上海市","district":"浦东新区","groupName":"y1","roleType":"LEADER"},{"id":19,"name":"gy3","email":"gy3@my.com","phone":"18817333553","enabled":true,"createDate":1448434849000,"province":"上海市","city":"上海市","district":"浦东新区","groupName":"y2","roleType":"MEMBER"},{"id":20,"name":"gy4","email":"gy4@my.com","phone":"18817333555","enabled":true,"createDate":1448434916000,"province":"上海市","city":"上海市","district":"浦东新区","groupName":"y1","roleType":"LEADER"},{"id":40,"name":"test_001","email":"test_001@sl.com","phone":"13322222232","enabled":true,"createDate":1448956025000,"province":"上海市","city":"上海市","district":"浦东新区","groupName":"销售一组","roleType":"MANAGER"},{"id":15,"name":"u001","email":"u001@sl.com","phone":"13323232232","enabled":true,"createDate":1448424687000,"province":"上海市","city":"上海市","district":"浦东新区","groupName":"销售一组","roleType":"MANAGER"},{"id":44,"name":"郭媛媛","email":"yuan@my.com","phone":"18817222338","enabled":true,"createDate":1449127665000,"province":"上海市","city":"上海市","district":"浦东新区","groupName":"销售一组","roleType":"LEADER"},{"id":53,"name":"test_004444","email":"linkinpark123456@163.com","phone":"13322221127","enabled":true,"createDate":1449541489000,"province":"吉林省","city":"白城市","district":"通榆县","groupName":"销售1","roleType":"MANAGER"},{"id":2,"name":"admin_001","email":"admin_001@sl.com","phone":"13323221222","enabled":true,"createDate":1448006489000,"province":"新疆","city":"阿克苏地区","district":"沙雅县","groupName":"上海黄浦--技术组","roleType":"MANAGER"},{"id":21,"name":"chenghao","email":"chenghao.yue@my.com","phone":"15721056893","enabled":true,"createDate":1448436137000,"province":"新疆","city":"阿克苏地区","district":"沙雅县","groupName":"上海黄浦--技术组","roleType":"LEADER"},{"id":1,"name":"chenglong","email":"chenglong.qian@my.com","phone":"17091956416","enabled":true,"createDate":1446730670000,"province":"新疆","city":"阿克苏地区","district":"沙雅县","groupName":"上海黄浦--技术组","roleType":"MANAGER"},{"id":10,"name":"g1","email":"g1@my.com","phone":"17091956401","enabled":true,"createDate":1446730670000,"province":"新疆","city":"阿克苏地区","district":"沙雅县","groupName":"上海黄浦--技术组","roleType":"ASSISTANT"},{"id":11,"name":"g2","email":"g2@my.com","phone":"17091956402","enabled":true,"createDate":1446730670000,"province":"新疆","city":"阿克苏地区","district":"沙雅县","groupName":"上海黄浦--技术组","roleType":"MANAGER"},{"id":12,"name":"g3","email":"g3@my.com","phone":"17091956403","enabled":true,"createDate":1446730670000,"province":"新疆","city":"阿克苏地区","district":"沙雅县","groupName":"上海黄浦--技术组","roleType":"MANAGER"},{"id":13,"name":"g4","email":"g4@my.com","phone":"17091956404","enabled":true,"createDate":1446730670000,"province":"新疆","city":"阿克苏地区","district":"沙雅县","groupName":"上海黄浦--技术组","roleType":"MANAGER"},{"id":14,"name":"g5","email":"g5@my.com","phone":"17091956405","enabled":false,"createDate":1446730670000,"province":"新疆","city":"阿克苏地区","district":"沙雅县","groupName":"上海黄浦--技术组","roleType":"MANAGER"},{"id":9,"name":"guoyuan","email":"yuan.guo@my.com","phone":"17091956411","enabled":true,"createDate":1446730670000,"province":"新疆","city":"阿克苏地区","district":"沙雅县","groupName":"上海黄浦--技术组","roleType":"MANAGER"},{"id":7,"name":"guoyuanyuan","email":"yuanyuan.guo@my.com","phone":"17091956415","enabled":true,"createDate":1446730670000,"province":"新疆","city":"阿克苏地区","district":"沙雅县","groupName":"上海黄浦--技术组","roleType":"MANAGER"},{"id":46,"name":"huangyuan","email":"huangyuan@my.com","phone":"17091956220","enabled":true,"createDate":1446730670000,"province":"新疆","city":"阿克苏地区","district":"沙雅县","groupName":"上海黄浦--技术组","roleType":"MANAGER"},{"id":39,"name":"junjie","email":"junjie.qian@my.com","phone":"17091956414","enabled":true,"createDate":1446730670000,"province":"新疆","city":"阿克苏地区","district":"沙雅县","groupName":"上海黄浦--技术组","roleType":"MANAGER"},{"id":37,"name":"sheldon","email":"sheldon@gmail.com","phone":"14712345678","enabled":true,"createDate":1448438143000,"province":"新疆","city":"阿克苏地区","district":"沙雅县","groupName":"上海黄浦--技术组","roleType":"MANAGER"},{"id":28,"name":"u002","email":"u002@sl.com","phone":"13323232234","enabled":true,"createDate":1448436502000,"province":"新疆","city":"阿克苏地区","district":"沙雅县","groupName":"上海黄浦--技术组","roleType":"MANAGER"},{"id":3,"name":"xingwei.zhang","email":"xingwei.zhang@my.com","phone":"17091261848","enabled":true,"createDate":1448357808000,"province":"新疆","city":"阿克苏地区","district":"沙雅县","groupName":"上海黄浦--技术组","roleType":"LEADER"},{"id":4,"name":"黄媛","email":"yuan_huang@sl.com","phone":"13789023823","enabled":false,"createDate":1448420674000,"province":"新疆","city":"阿克苏地区","district":"沙雅县","groupName":"上海黄浦--技术组","roleType":"MEMBER"},{"id":43,"name":"dd等等","email":"2343@00.com","phone":"10022222222","enabled":true,"createDate":1449041158000,"province":"河北省","city":"石家庄市","district":"新华区","groupName":"河北师范1","roleType":"MANAGER"}],"totalPage":1}};
			res.json(result);
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
