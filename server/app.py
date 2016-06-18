from flask import Flask, request
import pandas as pd

app = Flask(__name__, static_url_path='/static')


@app.route('/')
def root():
    return app.send_static_file('index.html')


@app.route('/dataset', methods=['POST'])
def dataset():
    request.get_data()
    df = pd.read_csv(request.files['file'])
    summed = df.sum(numeric_only=True)
    return summed.to_json(), 200


if __name__ == '__main__':
    app.run(debug=True)
