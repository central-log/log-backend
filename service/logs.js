var Basic = require('./basic');
var collectionName = 'logs';

var add = Basic.generateAdd(collectionName);
var find = Basic.generateFind(collectionName);

module.exports = {
    add: add,
    find: find
};
