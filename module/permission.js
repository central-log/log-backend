var MService = require('../service/mysql-base');
var tableName = 'permissions';

module.exports = {
    init: function (app) {
        app.get('/permission', function (req, res) {
            var limitSql = 'SELECT * FROM ??';

            if (req.query.name) {
                limitSql += ' WHERE name LIKE ? OR description LIKE ? ';
            }
            var criteria = '%' + req.query.name + '%';
            var allCritria = [tableName, criteria, criteria];

            MService.query(limitSql, allCritria, function (err, entity) {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                res.json(entity);
            });

        });

    }
};
