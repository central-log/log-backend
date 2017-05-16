module.exports = {
	init: function(app){
	/* --------------------Module Domain--------------------------*/
		var uris = {
		  "respCode": "_200", 
		  "result": {
		    "page": 1, 
		    "pageSize": 5, 
		    "totalCount": 9, 
		    "data": [
		      {
		        "id": 123, 
		        "domainId": 123, 
		        "name": "test", 
		        "uriPattern": "^/common.*", 
		        "description": "tsefdsfdsfdsf"
		      }
		    ]
		  }
		};
		var menus = {
		  "respCode": "_200", 
		  "result": {
		    "page": 1, 
		    "pageSize": 5, 
		    "totalCount": 11, 
		    "data": [
		      {
		        "id": 123, 
		        "domainId": 123, 
		        "parentId": 123, 
		        "name": "test", 
		        "isDropable": false, 
		        "uri": "/common/login", 
		        "description": "tsefdsfdsfdsf"
		      },
		      {
		        "id": 123, 
		        "domainId": 123, 
		        "parentId": 123, 
		        "name": "test", 
		        "isDropable": false, 
		        "uri": "/common/login", 
		        "description": "tsefdsfdsfdsf"
		      }
		    ]
		  }
		}
		// userIds seperated by comma
		app.post('/menu/query', function (req, res) {
			// /domain/:domainId/user?userIds=1,2,3
			res.json({"respCode":"_200","result":{"page":1,"pageSize":50,"totalCount":67,"data":[{"id":7,"domainId":1,"name":"all","description":"all","uriPattern":"^/.*","domainName":"techops"},{"id":5,"domainId":1,"name":"domain","description":"access domain resources","uriPattern":"^/domain.*","domainName":"techops"},{"id":6,"domainId":1,"name":"group","description":"access group resources","uriPattern":"^/group.*","domainName":"techops"},{"id":4,"domainId":1,"name":"menu","description":"access menu resources","uriPattern":"^/menu.*","domainName":"techops"},{"id":3,"domainId":1,"name":"role","description":"access role resources","uriPattern":"^/role.*","domainName":"techops"},{"id":2,"domainId":1,"name":"uri","description":"access uri resources","uriPattern":"^/uri.*","domainName":"techops"},{"id":1,"domainId":1,"name":"user","description":"access user resources","uriPattern":"^/user.*","domainName":"techops"}],"totalPage":1}});
		});

		// userIds seperated by comma
		app.post('/uri/query', function (req, res) {
			// /domain/:domainId/user?userIds=1,2,3
			res.json({"respCode":"_200","result":{"page":1,"pageSize":50,"totalCount":117,"data":[{"id":7,"domainId":1,"name":"all","description":"all","uriPattern":"^/.*","domainName":"techops"},{"id":5,"domainId":1,"name":"domain","description":"access domain resources","uriPattern":"^/domain.*","domainName":"techops"},{"id":6,"domainId":1,"name":"group","description":"access group resources","uriPattern":"^/group.*","domainName":"techops"},{"id":4,"domainId":1,"name":"menu","description":"access menu resources","uriPattern":"^/menu.*","domainName":"techops"},{"id":3,"domainId":1,"name":"role","description":"access role resources","uriPattern":"^/role.*","domainName":"techops"},{"id":2,"domainId":1,"name":"uri","description":"access uri resources","uriPattern":"^/uri.*","domainName":"techops"},{"id":1,"domainId":1,"name":"user","description":"access user resources","uriPattern":"^/user.*","domainName":"techops"}],"totalPage":1}});
		});
		
		

	}
}