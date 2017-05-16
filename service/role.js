var ObjectId = require('mongodb').ObjectId;

var addRole = function(role, callback) {
  // Get the documents collection
  var collection = DB.collection('documents');
  // Insert some documents
  collection.insertMany([role], function(err, result) {
    // assert.equal(err, null);
    // assert.equal(3, result.result.n);
    // assert.equal(3, result.ops.length);
    // console.log("Inserted 3 documents into the document collection");
    callback(err, result);
  });
}
var findRole = function(criteria, page, pageSize, callback){
  var collection = DB.collection('documents');
  // Find some documents
  var page = parseInt(page);
  var pageSize = parseInt(pageSize);

  if(page < 1){
    page = 1;
  }
  if(pageSize < 1){
    pageSize = 10;
  }
  collection.aggregate([
        { $match: criteria },
        { $group: { _id: null, count: { $sum: 1 } } }
      ],
  function(err, result){
    if(err){
      callback && callback(err);
      return;
    }
    var totalSize = result[0].count;
    var maxPage = Math.ceil(totalSize/pageSize);
    if(maxPage < page){
      page = maxPage;
    }

    collection.find(criteria).skip((page-1)*pageSize).limit(pageSize).toArray(function(err, docs) {
      // assert.equal(err, null);
      // assert.equal(2, docs.length);
      // console.log("Found the following records");
      callback && callback(err, docs, totalSize);
    });
  });
}
var findRoleById = function(id, callback){
  var collection = DB.collection('documents');
  // Find some documents
  collection.findOne({_id: new ObjectId(id)},function(err, doc) {
    // assert.equal(err, null);
    // assert.equal(2, docs.length);
    // console.log("Found the following records");
    callback && callback(err, doc);
  });
}
module.exports = {
  addRole: addRole,
  findRole: findRole,
  findRoleById: findRoleById
}
