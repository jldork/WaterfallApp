import {observable} from 'mobx';
import 'whatwg-fetch';

class UploadStore {
    @observable sums = {};
    @observable dataset = {};

    uploadData(csv) {
        this.dataset = csv[0];

        fetch('/dataset', {
            method: 'POST',
            body: this._fileToFormData(this.dataset)
        }).then(
            (response) => {
                console.log(response);
                console.log(JSON.parse(response));

                this.sums = response;
            }
        ).catch( () => {} );

    };

    _fileToFormData(file) {
        var formData = new FormData();
        formData.append('file', file);
        return formData
    };
}

export default UploadStore;