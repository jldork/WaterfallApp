var Bullet = require('bullet-pubsub');
var Constants = {
    CHANGE_EVENT: 'CHANGE_EVENT',
    ActionTypes: {}
};

var dataset, equation;

var Store = {

    getall: function () {
        return {
            dataset: dataset || {},
            equation: equation || ""
        }
    },
    addChangeListener: function (callback) {
        Bullet.on(Constants.CHANGE_EVENT, callback);
    },
    removeChangeListener: function (callback) {
        Bullet.removeListener(Constants.CHANGE_EVENT, callback);
    },
    emitChange: function () {
        Bullet.trigger(Constants.CHANGE_EVENT);
    },

    dispatchIndex: function (payload) {
        console.log(payload);
        switch (payload.type) {
        }
    }
};

module.exports = Store;