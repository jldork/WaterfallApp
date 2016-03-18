from flask import Flask, request

app = Flask(__name__, static_url_path='/static')

@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/dataset', methods=['POST'])
def dataset():
    print request.__dict__
    return '{ "fake_json":100}', 200


if __name__ == '__main__':
    app.run(debug=True)
