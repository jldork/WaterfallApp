/** @jsx m */

Store = require('./store');

var App = {
    state: {},
    _onChange: function () {
        App.state = Store.getAll();
    },

    controller: function () {
        return {
            onunload: function () {
                Store.removeChangeListener(App._onChange);
            }
        }
    },

    _onFileUpload: function () {
        console.log('FILE UPLOADING');
        m.request({
            method: "POST",
            url: "/upload",
            serialize: function (data) {
                return data
            }
        })
    },

    view: function (ctrl) {
        return (
            <form onSubmit={this._onFileUpload}>
                <input type="file" name="fileUpload"/>
                <button type="submit">Upload</button>
            </form>
        );
    }
};

Store.addChangeListener(App._onChange);

m.module(document.getElementById("waterfall"), App);
