var ObjectId = require('mongodb').ObjectId;
var DB = global.DB;

var add = function (collectionName) {
    return function (role, callback) {
      // Get the documents collection
        var collection = DB.collection(collectionName);
      // Insert some documents

        collection.insertMany([role], function (err, result) {
            callback(err, result);
        });
    };
};

var deleteMethod = function (collectionName) {
    return function (criteria, callback) {
      // Get the documents collection
        var collection = DB.collection(collectionName);
      // Insert some documents

        collection.deleteOne(criteria, function (err, result) {
            callback(err, result);
        });
    };
};


var find = function (collectionName) {
    return function (criteria, page, pageSize, callback) {
        var collection = DB.collection(collectionName);
    // Find some documents

        page = parseInt(page, 10);
        pageSize = parseInt(pageSize, 10);

        if (page < 1) {
            page = 1;
        }
        if (pageSize < 1) {
            pageSize = 10;
        }
        collection.aggregate([
      { $match: criteria },
      { $group: { _id: null, count: { $sum: 1 } } }
        ],
    function (err, result) {
        if (err) {
            callback && callback(err);
            return;
        }
        if (!result || !result.length) {
            callback && callback(null, [], 0);
            return;
        }
        var totalSize = result[0].count;
        var maxPage = Math.ceil(totalSize / pageSize);

        if (maxPage < page) {
            page = maxPage;
        }

        collection.find(criteria).skip((page - 1) * pageSize).limit(pageSize).toArray(function (e, docs) {
            callback && callback(e, docs, totalSize);
        });
    });
    };
};
var findById = function (collectionName) {
    return function (id, callback) {
        var collection = DB.collection(collectionName);
    // Find some documents

        collection.findOne({ _id: new ObjectId(id) }, function (err, doc) {
            callback && callback(err, doc);
        });
    };
};

var _update = function (collectionName, multiple) {
    return function (criteria, action, callback) {
        var collection = DB.collection(collectionName);
    // Find some documents

        collection[multiple ? 'update' : 'updateOne'](criteria, action, function (err, doc) {
            callback && callback(err, doc);
        });
    };
};
var update = function (collectionName) {
    return _update(collectionName, true);
};
var updateOne = function (collectionName) {
    return _update(collectionName, false);
};

module.exports = {
    generateAdd: add,
    generateFind: find,
    generateFindById: findById,
    generateUpdateOne: updateOne,
    generateUpdate: update,
    generateDelete: deleteMethod
};
