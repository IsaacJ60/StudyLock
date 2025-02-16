//https://github.com/adamvr/arduino-base64?utm_source=chatgpt.com
//https://github.com/jkb-git/ESP32Servo
//https://github.com/techiesms/ESP32-ChatGPT

#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <driver/i2s.h>
#include <ArduinoJson.h>
#include <WebServer.h>
#include <ESP32Servo.h>
//#include <Base64.h>
#include <esp_system.h>
//#include <base64_internal.h>
#include "mbedtls/base64.h" 

#define I2S_DOUT      25 // (SD)
#define I2S_BCLK      27 // (SCK)
#define I2S_LRC       26 // (LRCK / WS)

WebServer server(80);

const char* ssid = "JAD 8395";
const char* password = "807q33O-";
const char* chatgpt_key = "";
const char* temperature = "0.8"; //high temperature will give more unpredictble and fun reponses
const char* max_tokens = "15";
String Question = "";

#define servoPin1 13
#define servoPin2 12
#define servoPin3 14
Servo servo1;
Servo servo2;
Servo servo3;


const int bufferSize = 256; //for tts commmunciation


void setupI2S() {
    i2s_config_t i2s_config = {
        .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_TX), // Transmission (TX) mode
        .sample_rate = 16000,  // Choose the appropriate sample rate
        .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT,  // Choose the appropriate bit depth
        .channel_format = I2S_CHANNEL_FMT_ONLY_RIGHT,  // Only right channel for this example
        .communication_format = I2S_COMM_FORMAT_I2S,  // Standard I2S format
        .intr_alloc_flags = 0,  // Interrupt configuration
        .dma_buf_count = 8,     // DMA buffer count
        .dma_buf_len = 1024,    // DMA buffer length
    };

    i2s_pin_config_t pin_config = {
    .bck_io_num = I2S_BCLK,    // Bit Clock (BCK) pin
    .ws_io_num = I2S_LRC,     // Word Select (WS) pin
    .data_out_num = I2S_DOUT, // Data Out (DOUT) pin
    .data_in_num = I2S_PIN_NO_CHANGE // No change for Data In (DIN) pin
    };

    i2s_driver_install(I2S_NUM_0, &i2s_config, 0, NULL);
    i2s_set_pin(I2S_NUM_0, &pin_config);
}

/*void handleGet() {
    if (server.hasArg("plain")) {
        String body = server.arg("plain");
        Serial.println("Received POST data: " + body);
    } else {
        Serial.println("No POST data received.");
    }
    server.send(200, "text/plain", "ESP32 received POST request");
}*/

void handlePost() {
    if (server.hasArg("plain")) {
        const char* body = server.arg("plain").c_str();
        Serial.println(String("Received POST data: ") + body);

        StaticJsonDocument<100> doc;
        DeserializationError error = deserializeJson(doc, body);

        if (error) {
            Serial.println("Failed to parse JSON");
            server.send(400, "text/plain", "Invalid JSON");
            return;
        }

        const char* message = doc["message"];
        Serial.println("Message from POST: " + String(message));  
        gptRequest("Generate a 10 line response to get someone back to work. be very rude and creative");
        server.send(200, "text/plain", "ESP32 received POST request");
        doc.clear();
    }
}

void setup() {
    Serial.begin(115200);

    WiFi.mode(WIFI_STA);
    WiFi.disconnect();

    while (!Serial);

    WiFi.begin(ssid, password);
    Serial.print("Connecting to ");
    Serial.println(ssid);

    setupI2S();  // Missing semicolon fixed here
    
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }
    Serial.println("connected");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());

    //server.on("/", HTTP_GET, handleGet);
    server.on("/", HTTP_POST, handlePost);
    //https.end();  
    
    server.begin();

    servo1.attach(servoPin1);
    servo2.attach(servoPin2);
    servo3.attach(servoPin3);

    Serial.print("ESP32 IP Address: "); 
    Serial.println(WiFi.localIP()); 
}

void loop() {
    server.handleClient();

    delay(30);  //this prevents watchdog reset
}

void gptRequest(String inputValue){
    Serial.print("Ask your Question : ");
    while (!Serial.available()) {
    } 

    HTTPClient https;

    if (https.begin("https://api.openai.com/v1/completions")) {
        https.addHeader("Content-Type", "application/json");
        String token_key = String("Bearer ") + chatgpt_key;
        https.addHeader("Authorization", token_key);

        String payload = String("{\"model\": \"text-davinci-003\", \"prompt\": \"") + inputValue + String("\", \"temperature\": ") + temperature + String(", \"max_tokens\": ") + max_tokens + String("}");

        int httpCode = https.POST(payload);

        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
            String payload = https.getString();

            StaticJsonDocument<256>  doc;
            DeserializationError error =  deserializeJson(doc, payload);

            if(error){
              Serial.println("Failed to parse POST-request json");
            }
            else{
              String Answer = doc["choices"][0]["text"].as<const char*>();
              Answer = Answer.substring(2);
              Serial.print("Answer : "); Serial.println(Answer);
              getTTSAudio(Answer);
            }
        } else {
            Serial.printf("[HTTPS] GET... failed, error: %s\n", https.errorToString(httpCode).c_str());
        }
        
    } else {
        Serial.printf("[HTTPS] Unable to connect\n");
    }
    https.end();

    Question = "";
}

void getTTSAudio(String text) {
    String url = "https://texttospeech.googleapis.com/v1/text:synthesize?key=";
    
    HTTPClient http;
    http.begin(url);
    http.addHeader("Content-Type", "application/json");

    String payload = "{\"input\":{\"text\":\"" + text + "\"},\"voice\":{\"languageCode\":\"en-US\",\"name\":\"en-US-Wavenet-D\"},\"audioConfig\":{\"audioEncoding\":\"LINEAR16\",\"sampleRateHertz\":16000}}";
    
    int httpCode = http.POST(payload);
    if (httpCode > 0) {
        String response = http.getString();
        Serial.println(response);

        int startIdx = response.indexOf("\"audioContent\":\"") + 16;
        int endIdx = response.indexOf("\"}", startIdx);
        String audioBase64 = response.substring(startIdx, endIdx);
        Serial.println(audioBase64);
        

        uint8_t rawAudioData[bufferSize];
        size_t decodedLen = 0;  // Variable to store decoded length
        int audioSize = mbedtls_base64_decode(rawAudioData, bufferSize, &decodedLen, 
                                       (const unsigned char*)audioBase64.c_str(), audioBase64.length());
        
        playAudio(rawAudioData, audioSize);
        
    } else {
        Serial.println("Error in HTTP request");
    }

    http.end();
}

void playAudio(byte* rawAudioData, int size) {
    for (int i = 0; i < size; i++) {
        size_t bytesWritten;
        i2s_write(I2S_NUM_0, (char*)&rawAudioData[i], 1, &bytesWritten, portMAX_DELAY);
    }
}