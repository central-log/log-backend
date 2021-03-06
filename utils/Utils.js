'use strict';

var Utils = {};
/**
 * [mergeAttributes description]
 * Merge two object attribute, attributes in localObj will override those in defaultObj
 *
 * var Local = {
 *   env: {
 *     devMode: true
 *   }
 * }
 *
 * var Default = {
 *   env: {
 *     devMode: false,
 *     endPoint: 'localhost'
 *   }
 * }
 * Result is:
 * var Result = {
 *   env: {
 *     devMode: true,
 *     endPoint: 'localhost'
 *   }
 * }
 *
 *
 * @param  {[type]} localObj   [description]
 * @param  {[type]} defaultObj [description]
 * @return {[type]}            [description]
 */

Utils.mergeAttributes = function (localObj, defaultObj) {
    for (var p in defaultObj) {
        if (localObj.hasOwnProperty(p)) {
            if (typeof localObj[p] !== 'object') {
                defaultObj[p] = localObj[p];
            } else {
                defaultObj[p] = Utils.mergeAttributes(localObj[p], defaultObj[p]);
            }
        }
    }
    return defaultObj;
};

Utils.ensureSlash = function (path, needsSlash) {
    var hasSlash = path.endsWith('/');

    if (hasSlash && !needsSlash) {
        return path.substr(path, path.length - 1);
    } else if (!hasSlash && needsSlash) {
        return path + '/';
    } else {
        return path;
    }
};

module.exports = Utils;
