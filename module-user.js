module.exports = {
    init: function(app) {
        /* --------------------Module user--------------------------*/
        var users = {
            list: [{
                id: 1001,
                name: 'xiao ming',
                email: 'email',
                mobile: '18000000000',
                province: 'Shanghai',
                city: 'Shanghai',
                county: 'Huangpu',
                entryDate: '201-10-01',
                group: 'his group',
                disabled: false
            }, {
                id: 1002,
                name: 'xiao wang',
                email: 'email',
                mobile: '18000000001',
                province: 'Shanghai',
                city: 'Shanghai',
                county: 'Huangpu',
                entryDate: '201-10-11',
                group: 'his group',
                disabled: false
            }],
            page: 1,
            count: 10,
            total: 100
        };

        var userDetail = {
            result: {
                id: 1001,
                name: 'Xiao Ming',
                email: 'user@mail.com',
                phone: '18000000000',
                province: 'Shanghai',
                city: 'Shanghai',
                county: 'Huangpu',
                entryDate: '2015-10-10',
                groupName: 'Group2',
                disabled: false,
                roleType: 'MANAGER',
                createDate: new Date()
            }
        };

        var roleOfUser = {
            result: [{
                id: 2001,
                name: 'role 1',
                desc: 'role desc',
                createTime: '2015-10-01T10:00:00',
                modifyTime: '2015-10-01T10:00:00'
            }, {
                id: 2002,
                name: 'role 2',
                desc: 'role desc',
                createTime: '2015-10-01T10:00:00',
                modifyTime: '2015-10-01T10:00:00'
            }],
            page: 1,
            count: 10,
            total: 100
        };

        // GET All users
        app.get('/user', function(req, res) {
            res.json(users);
        });

        // add new user
        app.post('/user/', function(req, res) {
            res.json(req.body);
        });

        // Get user Detail
        app.get('/user/:userId', function(req, res) {
            res.json(userDetail);
        });

        // Edit user Detail
        app.post('/user/:userId', function(req, res) {
            res.json(req.body);
        });

        // get roles of user
        app.get('/user/:userId/role', function(req, res) {
            res.json(roleOfUser);
        });

        // delete role of user
        app.del('/user/:userId/role/:roleId', function(req, res) {
            res.json(req.body);
        });

        //
        app.post('/user/:userId/role', function(req, res) {
            req.json(roleOfUser);
        });
        /* --------------------End Module user--------------------------*/
    }
}
