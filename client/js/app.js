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

    view: function (ctrl) {
        return (
            <form action="dataset" method="post" enctype="multipart/form-data">
                <input type="file" name="fileUpload"/>
                <button type="submit" value="upload">Upload</button>
            </form>
        );
    }
};

Store.addChangeListener(App._onChange);

m.module(document.getElementById("waterfall"), App);
