/** @jsx m */

var Bullet = require('bullet-pubsub');

var Constants = {
    CHANGE_EVENT: 'CHANGE_EVENT',
    ActionTypes: {}
};

var Store = {
    getall: function(){
    }
};

var App = {
    state: {
    },
    _onChange: function() {
        App.state = Store.getAll();
    },

    controller: function() {
    },

    view: function(ctrl) {
        return m("div", "Hello"); 
    }
};

m.module(document.getElementById("waterfall"), App);
