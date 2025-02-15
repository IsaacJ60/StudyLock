from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/lock-in', methods=['POST'])
def lock_in():
    try:
        data = request.get_json()
        if data.get('status') == 'locked_in':
            return jsonify({"message": "User locked in successfully!"}), 200
        return jsonify({"error": "Invalid status"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)
