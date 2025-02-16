# StudyLock

## 📱Inspiration
In our day-and-age, distractions are very common, and sometimes hard to deal with. That's where this idea came into play. It started out as a simple voice assistant helper plushie, but evolved into a full multi-featured application that helps students keep focused while studying.

## 🏫 What is StudyLock?
StudyLock is a three-in-one studying application, which has:

📝 An integrated to-do list, allowing for keeping track of your goals easily.
🕹️ A gamified way to lock in that uses your webcam to detect distractions and award points to you when you're focused.
🧸 And a cute plushie to remind you to stay focused using OpenAI's text generation and Google Cloud's text-to-speech models!

## 🛠️ How We Built It
Frontend: We used React Native to create smooth UI.
Backend: Powered by Flask, handling the focus/smartphone detection algorithm. We integrated Twilio to send an SMS notification to the user's phone whenever they are distracted by it.
AI Models: We used OpenAI's GPT-4o mini for text generation, the Google Cloud TTS model for text-to-speech, and a YOLO model to detect smartphones and signs of slacking off.
Hardware ESP32 and MAX9587A I2S audio for plushie speech communication + Google Cloud TTS api. 5A step-down converter + MG996R servos were used for movement.

## 🔧 Challenges
ESP32 WiFi not working: - This was a huge hurdle for us because we couldn't connect an ESP32 to university enterprise WiFi with standard methods/components. After a ton of troubleshooting we solved the issue by using a 2.4GHz hotspot to allow for ESP32 WiFi connectivity.
Lack of I2S libraries: - This caused us a lot of trouble, but through careful planning and by searching through various sources, we were able to work through the issue and find a compatible and usable library for our purposes.
Yolo Model - The Yolo model was difficult to work with and integrate in our project. With drive and determination and lots of coffee to keep us through the night, we successfully got our Yolo model working as needed!

## 🏆 Accomplishments
We worked with several new technologies, including ESP32, React Native, and Twilio, which were all unfamiliar to us. We're proud of overcoming the steep learning curve and pushing ourselves to successfully bring this project to life.

## 🎓 Lessons Learned
We learn how to integrate different systems together (frontend-> backend-> AI model-> hardware)
The biggest takeaway? Knowing that pushing the boundaries of what we thought was possible can lead to amazing outcomes!

## 🚀 The Future of StudyLock
Improving the existing UI for the mobile app and website and adding new functionality like a pomodoro timer.
Adding more features to the hardware functionality such as a spray device to wake you up when you are on your phone.
