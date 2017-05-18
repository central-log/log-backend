var Basic = require('./basic');
var collectionName = 'domain';

var add = Basic.generateAdd(collectionName);
var find = Basic.generateFind(collectionName);
var findById = Basic.generateFindById(collectionName);

module.exports = {
  add: add,
  find: find,
  findById: findById
}
