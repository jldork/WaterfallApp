/** @jsx m */

var Store = require('./store'),
    m = require('mithril'),
    Provider = require('mithril-redux').Provider;

var App = {
    view: function(ctrl) {
        return (
            <h1>Waterfall Chart Generator</h1>
        );
    }
}; 

m.mount(document.body, Provider.init(Store, m, App));
