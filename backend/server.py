from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import base64
from PIL import Image
from io import BytesIO
from twilio.rest import Client
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

load_dotenv()

# Twilio credentials from .env
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER')

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# Load an Open Images Dataset V7 pretrained YOLOv8n model
model = YOLO("yolo11n.pt")

detection_queue = []

# Function to detect a phone in an image
def detect_phone(image_path, phoneNumber):
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
            if "cell phone" in class_name.lower() and confidence > 0.1:
                phone_detected = True
                print(f"Detected phone with confidence {confidence}")

                if detection_queue[-1] == True:
                    sendMessage(phoneNumber, "GET OFF YOUR PHONE THIS INSTANT!!!")
                    detection_queue.append(True)
                    print(detection_queue)
                    return -1
                            
            
    # If no phone detected, add False to the queue
    if phone_detected:
        detection_queue.append(True)
    else:
        detection_queue.append(False)
        
    print(detection_queue)

    return 1  # No phone detected

def sendMessage(to_phone_number, message_body):
    if not to_phone_number or not message_body:
        print("Missing phone number or message!")
        return

    try:
        message = client.messages.create(
            body=message_body,
            from_=TWILIO_PHONE_NUMBER,
            to=to_phone_number
        )
        print(f"SMS sent successfully! Message SID: {message.sid}")
    except Exception as e:
        print(f"Error sending SMS: {str(e)}")


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
            
            phoneNumber = data.get('phoneNumber')
            
            print("HERES THE PHONE NUMBER:", phoneNumber)

            # Run phone detection
            phone_detected = detect_phone(img_path, phoneNumber)

            return jsonify({
                "message": "Phone detected!" if phone_detected != 1 else "No phone detected.",
                "score": phone_detected,
                "phone_detected": True if phone_detected != 1 else False
            }), 200

        return jsonify({"error": "Invalid image"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)
