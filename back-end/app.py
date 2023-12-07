from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/api/data', methods=['GET'])
def get_data():
    try:
        response = requests.get('http://api.open-notify.org/iss-now.json')
        response.raise_for_status()
        data = response.json()
        return jsonify(data)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return jsonify({"error": "Failed to fetch data"}), 500
    except json.decoder.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        return jsonify({"error": "Invalid JSON in the response"}), 500

if __name__ == '__main__':
    app.run()