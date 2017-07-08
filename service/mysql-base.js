var pool = global.Pool;

function query(sql, values, callback) {
    pool.getConnection(function (err, connection) {
  // Use the connection
        var dbsql = connection.query(sql, values, function (error, results, fields) {
    // And done with the connection.
            connection.release();

            // Handle error after the release.
            callback && callback(error, results, fields);

    // Don't use the connection here, it has been returned to the pool.
        });

        console.log(dbsql.sql);
    });
}
module.exports = { query: query };
