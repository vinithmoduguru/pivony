from flask import Flask, jsonify

app = Flask(__name__)

dummy_data = [
    {'id': 1, 'name': "A", 'composition': [30, 20, 20, 10, 20]},
    {'id': 2, 'name': "B", 'composition': [40, 10, 15, 10, 25]},
    {'id': 3, 'name': "C", 'composition': [35, 25, 10, 10, 20]},
    {'id': 4, 'name': "D", 'composition': [30, 25, 20, 10, 15]},
]

@app.route('/', methods=['GET'])
def get_data():
    response = jsonify(dummy_data)
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=105)