import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import {observer} from 'mobx-react';
import UploadStore from './UploadStore';
import WaterfallSTore from './WaterfallStore';

const uploadStore = new UploadStore();

class Upload extends Component {
    onDrop = (file) => {
        uploadStore.uploadData(file);
        this.props.wfStore.uploaded = true;
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


