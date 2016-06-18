import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import {observer} from 'mobx';
import UploadStore from './UploadStore';

const uploadStore = new UploadStore();

class Upload extends Component {
    onDrop = (file) => {
        uploadStore.uploadData(file);
    };

    render() {
        return (
            <div class="upload">
                <ul>
                    <h2>Upload a dataset</h2>
                    <li>Column Headers included</li>
                    <li>Currently accepting CSV files</li>
                </ul>

                <Dropzone onDrop={this.onDrop}>
                    <div>Drag and Drop CSV file here</div>
                </Dropzone>
            </div>
        );
    }
}

export default Upload;


