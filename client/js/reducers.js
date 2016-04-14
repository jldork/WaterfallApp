/** @jsx m */

export function submitEquationForm (state={}, action={}){
    switch (action.type) {
        case DATASET_UPLOAD:
            e.preventDefault();
            var fileObject = e.target[0].files[0];

            m.request({
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
}    

m.module(document.getElementById("waterfall"), App);
