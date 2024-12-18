#include "SpecificConstants.hpp"
#include "MQTTCommonOperations.hpp"

/**** esp32 sensor pin Settings *******/
const int pin_lo_minus = 2;
const int pin_lo_plus = 15;
const int sdn = 18;
const int analog_pin = 34;

const float MIN_RANDOM_VALUE = 0.0;
const float MAX_RANDOM_VALUE = 5.0;


/**** Secure WiFi Connectivity Initialisation *****/
WiFiClientSecure espClient;

/**** MQTT Client Initialisation Using WiFi Connection *****/
PubSubClient client(espClient);

/**** FUNCTIONS *****/
/***** Callback Method, allow the sensor to react when Receiving MQTT messages ****/
void callback(char *topic, byte *payload, unsigned int length) {
    Serial.print("Message arrived in topic: ");
    Serial.println(topic);

    String received_message;
    for (int i = 0; i < length; i++) {
        Serial.print((char) payload[i]);
        received_message += (char)payload[i];
    }
    Serial.println();

    // Parse the received JSON message
    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, received_message);
    if (error) {
        Serial.print("deserializeJson() failed: ");
        Serial.println(error.c_str());
        return;
    }

    String received_command = doc[MSG_CMD];
    interactWithReceivedCommand(client, received_command, MQTT_TOPIC_TO_SPEAK_ON, allow_to_publish);
}

/**** MAIN PROGRAM *****/

void setup() {
    // Set software serial baud to 115200;
    Serial.begin(115200);
    pinMode(pin_lo_plus, INPUT); // Setup for leads off detection LO +
    pinMode(pin_lo_minus, INPUT); // Setup for leads off detection LO -
    pinMode(sdn ,OUTPUT);
    pinMode(analog_pin, INPUT);
    digitalWrite(sdn, HIGH);

    setup_wifi(SSID, PASSWORD);
    setCACertForTLS(espClient, ROOT_CA);      // enable this line and the the "certificate" code for secure connection
    
    configTime(GMT_OFFSET_SEC, DAYLIGHT_OFFSET_SEC, NTP_SERVER); // For timestamp

    // Connecting to mqtt broker
    client.setServer(MQTT_BROKER, MQTT_PORT);
    client.setCallback(callback); // how to answer to mqtt messages
}

// Add this new helper function before the loop()
float generateRandomValue() {
    return MIN_RANDOM_VALUE + static_cast<float>(random(1000)) / 1000.0 * (MAX_RANDOM_VALUE - MIN_RANDOM_VALUE);
}

// Modify the loop() function
void loop() {
    if (!client.connected()) {
        reconnect(client, MQTT_USERNAME, MQTT_PASSWORD, MQTT_TOPIC_TO_LISTEN_ON);
    }
    client.loop();

    unsigned long currentMillis = millis(); 
    if (currentMillis - previousMillis >= 1000) {
        previousMillis = currentMillis;
        if (allow_to_publish) {
            float testValue = generateRandomValue();
            Serial.print("Sending value: ");
            Serial.println(testValue);
            publishValue(client, MQTT_TOPIC_TO_SPEAK_ON, testValue, true);
        }
    }
}
