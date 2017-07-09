var Member = require('../service/member');
var md5 = require('md5');

module.exports = {
    init: function (app) {
        app.post('/actor', function (req, res) {
            var body = req.body;

            if (!body.username || !body.password) {
                res.status(400).send('Bad Request! Required Parameters: username, password');
                return;
            }

            var criteria = {
                'email': body.username,
                'password': md5(body.password)
            };

            Member.find(criteria, 1, 1, function (err, docs, totalSize) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                if (totalSize) {
                    req.session.email = body.username;
                    return res.json({
                        email: body.username
                    });
                } else {
                    res.status(500).send({ errMsg: '用户名或密码错误' });
                }
            });
        });

        app.get('/actor', function (req, res) {
            if (req.session.email) {
                return res.json({
                    email: req.session.email
                });
            } else {
                return res.json({});
            }
        });
    }
};
