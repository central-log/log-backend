'use strict';

var prop = require('properties');
var Q = require('q');
var Utils = require('../utils/Utils.js');

function Config() {
    this._localPropertiesPath = __dirname + '/local.properties';
    this._defaultPropertiesPath = __dirname + '/default.properties';
}
Config.prototype.init = function () {
    var that = this;
    var deferred = Q.defer();

    Q.allSettled([this._load(this._defaultPropertiesPath), this._load(this._localPropertiesPath)])
        .spread(function (defaultPropertiesRes, localPropertiesRes) {
            var findDefault = defaultPropertiesRes.state === 'fulfilled',
                foundLocal = localPropertiesRes.state === 'fulfilled';

            if (!findDefault && !foundLocal) {
                deferred.reject([defaultPropertiesRes.reason, localPropertiesRes.reason]);
                return;
            }
            if (!findDefault) {
                defaultPropertiesRes.value = {};
            }
            if (!foundLocal) {
                localPropertiesRes.value = {};
            }
            // using the local properties override default properties
            // var localProperties = localPropertiesRes.value;

            that.configs = Utils.mergeAttributes(localPropertiesRes.value, defaultPropertiesRes.value);
            that.configs.buildNumber = new Date().getTime();
            deferred.resolve(that.configs);
        }).done();
    return deferred.promise;
};
Config.prototype._load = function (path) {
    var deferred = Q.defer();

    prop.parse(path, { path: true, sections: true }, function (error, data) {
        if (error) {
            console.warn('Load File ' + path + ' error!', error);
            deferred.reject(error);
            return;
        }
        deferred.resolve(data);
    });
    return deferred.promise;
};

module.exports = new Config();
