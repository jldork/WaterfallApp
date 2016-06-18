import {observable} from 'mobx';
import 'whatwg-fetch';

class UploadStore {
    @observable sums = {};
    @observable dataset = {};

    uploadData(csv) {
        this.dataset = csv[0];

        fetch('/dataset', {
            method: 'POST',
            body: fileToFormData(this.dataset)
        })
            .then(checkStatus)
            .then((response)=> {
                response.json().then((json)=> {
                    this.sums = json
                })
            })
    };
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error
    }
}

function fileToFormData(file) {
    var formData = new FormData();
    formData.append('file', file);
    return formData
}


export default UploadStore;