/** @jsx m */

Store = require('./store');

var App = {
    state: {},
    _onChange: function () {
        App.state = Store.getAll();
    },

    controller: function () {
        this.onUpload = function (e) {
            e.preventDefault();
            var fileObject = e.target[0].files[0];

            return m.request({
                method: "POST",
                url: "/dataset",
                data: fileObject,
                serialize: function (uploadedFile) {
                    var formData = new FormData();
                    formData.append(uploadedFile.name, uploadedFile);
                    return formData
                }
            })
        }
    },

    view: function (ctrl) {
        return (
            <form id="uploadForm" onsubmit={ctrl.onUpload}>
                <input type="file" name="fileUpload" formenctype="multipart/form-data"/>
                <button type="submit" value="upload">Upload</button>
            </form>
        );
    }
};

Store.addChangeListener(App._onChange);

m.module(document.getElementById("waterfall"), App);
