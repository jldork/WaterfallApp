/** @jsx m */

var Store = require('./store'),
    m = require('mithril'),
    Provider = require('mithril-redux').Provider,
    DatasetUpload = require('./datasetUpload'),
    EquationInput = require('./equationInput');

var App = {
    view: function (ctrl) {
        return (
            <div id="waterfall">
                <h1>Waterfall Chart Generator</h1>
                <DatasetUpload />
                <EquationInput />
            </div>
        );
    }
};

m.mount(document.body, Provider.init(Store, m, App));
