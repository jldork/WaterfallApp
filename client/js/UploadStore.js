import {observable} from 'mobx';
import 'whatwg-fetch';

class UploadStore {
    @observable sums = {};

    uploadData(csv) {

        fetch('/dataset', {
            method: 'POST',
            body: csv
        }).then( // POST REQUEST SUCCESS
            (response) => {this.sums = response}
        ).catch( // POST REQUEST FAILED
            () => {}
        )

    };
}

export default UploadStore;