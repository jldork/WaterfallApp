Store = require('./Store');

module.exports = function (payload) {
    Store.dispatchIndex(payload);
};