from flask import Flask, request
import pandas as pd

app = Flask(__name__, static_url_path='/static')

@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/dataset', methods=['POST'])
def dataset():
    post_files = request.files
    filename = post_files.keys()[0]
    dataframe = pd.read_csv(post_files[filename])

    return '{ "fake_json":100}', 200


if __name__ == '__main__':
    app.run(debug=True)
