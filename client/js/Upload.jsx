import React from 'react';
import Dropzone from 'react-dropzone';

var Upload = React.createClass({
    onDrop: function (files) {
        console.log('Received files: ', files)
    },

    render: function () {
        return (
            <div class="upload">
                <ul>
                    <h2>Upload a dataset</h2>
                    <li>Headers included</li>
                    <li>Currently accepting CSV files</li>
                </ul>

                <Dropzone onDrop={this.onDrop}>
                    <div>Drag and Drop CSV file here</div>
                </Dropzone>
            </div>
        );
    }
});

module.exports = Upload;


