from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import base64
from PIL import Image
from io import BytesIO

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load an Open Images Dataset V7 pretrained YOLOv8n model
model = YOLO("yolo11n.pt")

detection_queue = []

# Function to detect a phone in an image
def detect_phone(image_path):
    results = model(image_path)  # Run YOLOv8 model on the image
    phone_detected = False
    
    if len(detection_queue) > 4:
        del detection_queue[0]
    
    for result in results:
        for box in result.boxes:
            class_id = int(box.cls[0])  # Get class ID
            confidence = float(box.conf[0])  # Confidence score
            class_name = model.names[class_id]  # Get class name
            
            # Check if the detected class is a 'Cell phone' (class label may vary)
            if "cell phone" in class_name.lower() and confidence > 0.2:
                phone_detected = True
                print(f"Detected phone with confidence {confidence}")

                if detection_queue[-1] == True:
                    detection_queue.append(True)
                    print(detection_queue)
                    return True
                
            
    # If no phone detected, add False to the queue
    if phone_detected:
        detection_queue.append(True)
    else:
        detection_queue.append(False)
        
    print(detection_queue)

    return False  # No phone detected

@app.route('/api/lock-in', methods=['POST'])
def lock_in():
    try:
        data = request.get_json()
        if data.get('status') == 'locked_in':
            return jsonify({"message": "User locked in successfully!"}), 200
        return jsonify({"error": "Invalid status"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/image', methods=['POST'])
def image():
    try:
        data = request.get_json()
        if 'image' in data:
            # Decode base64 image
            image_data = data['image']
            img_bytes = base64.b64decode(image_data.split(',')[1])  # Remove header
            img = Image.open(BytesIO(img_bytes))
            img_path = "uploaded_image.jpg"
            img.save(img_path)  # Save the image

            # Run phone detection
            phone_detected = detect_phone(img_path)

            return jsonify({
                "message": "Phone detected!" if phone_detected else "No phone detected.",
                "phone_detected": phone_detected
            }), 200

        return jsonify({"error": "Invalid image"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)
