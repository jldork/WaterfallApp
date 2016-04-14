var DatasetUpload = {
    _onClick: function(){
    },
    view: function (ctrl) {
        return (
            <div class="form">
                <label for="dataset">Upload your dataset</label>
                <input type="file" name="dataset"/>
                <button>Upload Data</button>
            </div>
        )
    }
};

module.exports = DatasetUpload;