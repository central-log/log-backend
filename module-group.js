module.exports = {
    init: function(app) {
        /* --------------------Module group--------------------------*/

        var groupsDropdown = {
            "respCode": "_200",
            "result": {
                "page": 1,
                "pageSize": 5,
                "totalCount": 20,
                "data": [{
                    "id": 222,
                    "parentGroupId": 123,
                    "groupType": "SALES",
                    "name": "dmsadsad",
                    "parentGroupName": "description",
                    "province": "Shanghai",
                    "city": "Shanghai",
                    "district": "黄浦",
                    "enabled": true
                }, {
                    "id": 223,
                    "parentGroupId": 123,
                    "groupType": "CUSTOMER_SERVICE",
                    "name": "dmsadsad",
                    "parentGroupName": "description",
                    "province": "Shanghai",
                    "city": "Shanghai",
                    "district": "黄浦",
                    "enabled": true
                }, {
                    "id": 224,
                    "parentGroupId": 123,
                    "groupType": "RISK",
                    "name": "dmsadsad",
                    "parentGroupName": "description",
                    "province": "Shanghai",
                    "city": "Shanghai",
                    "district": "黄浦",
                    "enabled": true
                }]
            }
        };
        var groups = {
            list: [{
                id: 1001,
                name: 'group 1',
                desc: 'group description',
                supGroup: 'super group',
                province: '上海市',
                city: '上海市',
                county: '黄浦区',
                disabled: false
            }, {
                id: 1002,
                name: 'group 2',
                desc: 'group description',
                supGroup: 'super group',

                province: '上海市',
                city: '上海市',
                county: '黄浦区',
                disabled: false
            }],
            page: 1,
            count: 10,
            total: 100
        };

        var groupDetail = {
            result: {
                "id": 40,
                "province": "上海市",
                "city": "上海市",
                "district": "浦东新区",
                "name": "1213313",
                "enabled": true,
                "parentGroupId": 123,
                "parentGroupName": "parent group",
                "createDate": new Date(),
                "lastUpdate": new Date(),
                "description": "fasfadsfdaf"
            }
        };

        var userOfGroup = {
            list: [{
                name: 'name 1',
                email: 'email 1',
                mobile: '18000000000',
                entryDate: '201-10-01',
                province: 'Shanghai',
                city: 'Shanghai',
                county: 'Huangpu',
                group: 'group of this'
            }, {
                name: 'name 2',
                email: 'email 2',
                mobile: '18000000001',
                entryDate: '201-10-11',
                province: 'Shanghai',
                city: 'Shanghai',
                county: 'Huangpu',
                group: 'group of this'
            }, {
                name: 'name 3',
                email: 'email 3',
                mobile: '18000000003',
                entryDate: '201-10-21',
                province: 'Shanghai',
                city: 'Shanghai',
                county: 'Huangpu',
                group: 'group of this'
            }],
            page: 1,
            count: 10,
            total: 100
        };

        // GET All groups
        app.get('/group', function(req, res) {
            res.json(groups);
        });

        // Add new group
        app.post('/group/', function(req, res) {
            res.json(req.body);
        });
        // Add new group
        app.post('/group/query', function(req, res) {
            res.json(groupsDropdown);
        });

        //Add sub group
        app.post('/group/:groupId/subgroup', function(req, res) {
            res.json(req.body);
        });

        // Get group Detail
        app.get('/group/:groupId', function(req, res) {
            groupDetail.result.id = req.params.groupId;
            groupDetail.result.groupType = 'SALES';
            res.json(groupDetail);
        });

        // Edit group Detail
        app.post('/group/:groupId', function(req, res) {
            res.json(req.body);
        });

        // users in group
        app.get('/group/:groupId/user', function(req, res) {
            res.json(userOfGroup)
        });
        /* --------------------End Module group--------------------------*/

        var atttchment = {
            "name": "息字段定义.xlsx",
            "createDate": 1489485712457,
            "category": "GLOAN",
            "type": "ID_CARD",
            "location": "/oss/attachments/GLOAN/a24667eb-5c25-46da-aa1b-ee5ea0fc4972",
            "contentType": "application/wps-office.xlsx"
        };
        var atttchments = {
            "result": "success",
            "errorMsg": null,
            "errorCode": null,
            "content": []
        };
        app.get('/api/oss/attachments', function(req, res) {
            atttchments.content.push(atttchment);
            setTimeout(function() {
                res.json(atttchments)
            }, 3000);
        });
    }
}
