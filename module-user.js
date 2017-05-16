var DAO = require('./service/user');
var InternalErrorResponse = require('./entity/InternalErrorResponse');
var ObjectResponse = require('./entity/ObjectResponse');
var PaginationResponse = require('./entity/PaginationResponse');

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

        app.post('/user/query', function (req, res) {
          var params = req.body;
          if(!params.page || !params.pageSize){
            res.status(400).send('Bad Request! Required Parameters: page and pageSize');
          }

          var criteria = {};
          if(params.email){
            criteria.email = { $regex: new RegExp(params.email) };
          }

          DAO.find(criteria, params.page, params.pageSize, function(err, docs, totalSize){
            if(err){
              res.json(new InternalErrorResponse());
              return;
            }
            return res.json(new PaginationResponse(docs, params.page, params.pageSize,totalSize));
          });
        });
        // GET All users
        app.get('/user', function(req, res) {
            res.json(users);
        });

        // add new user
        app.post('/user', function(req, res) {
          if(!req.body.name || !req.body.email){
            res.status(400).send('Bad Request! Required Parameters: name and description');
            return;
          }

          var timestamp = new Date().getTime();
          var roleEntity = {
            name: req.body.name,
            email: req.body.email,
            createDate: timestamp,
            lastUpdate: timestamp,
            enabled: true
          }
          DAO.add(roleEntity, function(err, result){
            if(err){
              res.json(new InternalErrorResponse());
              return;
            }
            res.json(new ObjectResponse(roleEntity));
          });
        });

        // Get user Detail
        app.get('/user/:userId', function(req, res) {
          DAO.findById(req.params.userId, function(err, doc){
            if(err){
                res.json(new InternalErrorResponse());
                return;
            }
            res.json(new ObjectResponse(doc?doc:null));
          });
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
