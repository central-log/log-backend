var Basic = require('./basic');
var collectionName = 'users';

var add = Basic.generateAdd(collectionName);
var find = Basic.generateFind(collectionName);
var findById = Basic.generateFindById(collectionName);
var deleteMethod = Basic.generateDelete(collectionName);
var updateOne = Basic.generateUpdateOne(collectionName);

module.exports = {
    add: add,
    find: find,
    findById: findById,
    delete: deleteMethod,
    updateOne: updateOne
};
