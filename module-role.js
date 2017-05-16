var uuidV4 = require('uuid/v4');

var generateResponse = function (statusCode, body, message) {
  return {
    "respCode": "_"+statusCode,
    "result": body,
    "errMsg": message
  }
}
var DB = {
  roles: []
};

module.exports = {
    init: function(app) {
        /* --------------------Module Role--------------------------*/
        var roleList = {
            "respCode": "_200",
            "result": {
                "page": 1,
                "pageSize": 5,
                "totalCount": 7,
                "data": [
                    {
                        "id": 123,
                        "name": "fdsf",
                        "description": "fasdf",
                        "enabled": false,
                        "createDate": new Date().getTime(),
                        "lastUpdate": new Date().getTime()
                    }
                ]
            }
        };
        var allRoles = {
            "respCode": "_200",
            "result": {
                "page": 1,
                "pageSize": 5,
                "totalCount": 20,
                "data": [
                    {
                        "id": 123,
                        "name": "fdsf",
                        "description": "fasdf",
                        "enabled": false,
                        "createDate": null,
                        "lastUpdate": null
                    }, {
                        "id": 123,
                        "name": "fdsf",
                        "description": "fasdf",
                        "enabled": false,
                        "createDate": null,
                        "lastUpdate": null
                    }, {
                        "id": 123,
                        "name": "fdsf",
                        "description": "fasdf",
                        "enabled": false,
                        "createDate": null,
                        "lastUpdate": null
                    }
                ]
            }
        };

        var roleMenus = [
            {
                id: '1001',
                domain: 'TechOps',
                parent: '',
                name: '菜单1',
                url: 'http://www.baidu.com/',
                desc: 'This is 菜单1'
            }, {
                id: '1002',
                domain: 'TechOps',
                parent: '1001',
                name: '菜单2',
                url: 'http://www.baidu.com/',
                desc: 'This is 菜单2'
            }, {
                id: '1003',
                domain: 'TechOps',
                parent: '',
                name: '菜单3',
                url: 'http://www.baidu.com/',
                desc: 'This is 菜单3'
            }
        ];

        var roleURLs = [
            {
                id: '1001',
                domain: 'TechOps',
                name: '模式1',
                mode: 'http://www.baidu.com/',
                desc: 'This is 模式1'
            }, {
                id: '1002',
                domain: 'TechOps',
                name: '模式2',
                mode: 'http://www.baidu.com/',
                desc: 'This is 模式2'
            }, {
                id: '1003',
                domain: 'TechOps',
                name: '模式3',
                mode: 'http://www.baidu.com/',
                desc: 'This is 模式3'
            }
        ];
        var roleUsers = [
            {
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
            }
        ];

        // GET All Roles
        app.post('/role/query', function(req, res) {
            var params = req.body;
            if(params.name){

            }
            if(!params.page){

            }
            if(!params.pageSize){

            }

            return res.json({
                "respCode": "_200",
                "result": {
                    "page": 1,
                    "pageSize": 50,
                    "totalCount": 52,
                    "data": [
                        {
                            "id": 2,
                            "name": "倒萨大师大师",
                            "description": "12314113",
                            "enabled": false,
                            "createDate": 1448936381000,
                            "lastUpdate": 1448961314000
                        }, {
                            "id": 4,
                            "name": "客服",
                            "description": "service role",
                            "enabled": true,
                            "createDate": 1449136807000,
                            "lastUpdate": 1449136799000
                        }, {
                            "id": 5,
                            "name": "角色002",
                            "description": "啊啊",
                            "enabled": true,
                            "createDate": 1449288704000,
                            "lastUpdate": 1449289015000
                        }, {
                            "id": 1,
                            "name": "超级管理员",
                            "description": "超级管理员",
                            "enabled": true,
                            "createDate": 1448434772000,
                            "lastUpdate": 1448434772000
                        }, {
                            "id": 3,
                            "name": "销售",
                            "description": "sale role",
                            "enabled": true,
                            "createDate": 1449136721000,
                            "lastUpdate": 1449136713000
                        }
                    ],
                    "totalPage": 1
                }
            });
        });
        // Get Role Detail
        app.get('/role/:roleId', function(req, res) {
            var roleEntity = DB.roles.find(function(role){
              return role.id === req.params.roleId;
            })
            if(roleEntity){
              res.json(generateResponse(200, roleEntity));
            }else{
              res.json(generateResponse(200, null));
            }
        });

        // userIds seperated by comma
        app.get('/role/:roleId/menu', function(req, res) {
            // /domain/:domainId/user?userIds=1,2,3
            res.json({"respCode": "_200"});
        });

        // userIds seperated by comma
        app.get('/role/:roleId/uri', function(req, res) {
            // /domain/:domainId/user?userIds=1,2,3
            res.json({"respCode": "_200"});
        });

        // add Role by name, disabled
        app.post('/role', function(req, res) {
            if(!req.body.name || !req.body.description){
              res.status(400).send('Bad Request! Required Parameters: name and description');
              return;
            }

            var timestamp = new Date().getTime();
            var roleEntity = {
              id: uuidV4(),
              name: req.body.name,
              description: req.body.description,
              createDate: timestamp,
              lastUpdate: timestamp,
              enabled: true
            }
            //Todo: Save to DB
            DB.roles.push(roleEntity);
            res.json({
                "respCode": "_200",
                "result": roleEntity
            });
        });
        // disable, modify
        app.post('/role/:roleId', function(req, res) {

            if (req.body.desc === 'failed') {
                res.sendStatus(500);
            } else {
                var role = null;
                for (var i = 0, len = allRoles.length; i < len; i++) {
                    if (allRoles[i].id === req.params.roleId) {
                        role = allRoles[i];
                        role.name = req.body.name;
                        role.desc = req.body.desc;
                        break;
                    }
                }
                res.sendStatus(204);
            }
        });
        // get all menus related to the role
        app.get('/role/:roleId/menu', function(req, res) {
            res.json(roleMenus);
        });
        app.put('/role/:roleId/menu', function(req, res) {
            // /role/:roleId/menu?menuIds=
            res.sendStatus(204);
        });
        // get all menus related to the role
        app.delete('/role/:roleId/menu/:menuId', function(req, res) {
            var role = null;
            for (var i = 0, len = roleMenus.length; i < len; i++) {
                if (roleMenus[i].id === req.params.menuId) {
                    roleMenus.splice(i, 1);
                    break;
                }
            }
            res.sendStatus(204);
        });

        // get all urls related to the role
        app.get('/role/:roleId/url', function(req, res) {
            res.json(roleURLs);
        });
        // get all menus related to the role
        app.delete('/role/:roleId/url/:urlId', function(req, res) {
            var role = null;
            for (var i = 0, len = roleURLs.length; i < len; i++) {
                if (roleURLs[i].id === req.params.urlId) {
                    roleURLs.splice(i, 1);
                    break;
                }
            }
            res.sendStatus(204);
        });
        // get all menus related to the role
        app.put('/role/:roleId/url', function(req, res) {
            res.sendStatus(204);
        });

        app.get('/role/:roleId/user', function(req, res) {
            res.json(roleUsers);
        });
        app.put('/role/:roleId/user', function(req, res) {
            res.sendStatus(204);
        });
        app.delete('/role/:roleId/user/:userId', function(req, res) {
            var role = null;
            for (var i = 0, len = roleUsers.length; i < len; i++) {
                if (roleUsers[i].id === req.params.userId) {
                    roleUsers.splice(i, 1);
                    break;
                }
            }
            res.sendStatus(204);
        });

        /* --------------------End Module Role--------------------------*/
    }
}
