var pool = global.Pool;

function query(sql, values, callback) {
    pool.getConnection(function (err, connection) {
  // Use the connection
        err && console.log(err);
        var dbsql = connection.query(sql, values, function (error, results, fields) {
    // And done with the connection.
            error && console.log(error);
            connection.release();
            // Handle error after the release.
            callback && callback(error, results, fields);

    // Don't use the connection here, it has been returned to the pool.
        });

        console.log(dbsql.sql);
    });
}
function transaction(sql, values, callback) {
    pool.getConnection(function (e, connection) {
        e && console.log(e);
        connection.beginTransaction(function (err) {
            if (err) {
                // connection.rollback();
                err && console.log(err);
                callback && callback(err, connection);
                return;
            }
            // Use the connection
            var dbsql = connection.query(sql, values, function (error, results, fields) {
              // And done with the connection.
                // connection.release();
                error && console.log(error);
                      // Handle error after the release.
                callback && callback(error, connection, results, fields);

              // Don't use the connection here, it has been returned to the pool.
            });

            console.log(dbsql.sql);
        });
    });
}
module.exports = { query: query, transaction: transaction };
