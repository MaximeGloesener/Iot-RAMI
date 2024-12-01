#include "SpecificConstants.hpp"
#include "MQTTCommonOperations.hpp"

/**** Secure WiFi Connectivity Initialisation *****/
WiFiClientSecure microcontrollerClientOverWifi;

/**** MQTT Client Initialisation Using WiFi Connection *****/
PubSubClient MqttClient(microcontrollerClientOverWifi);

/**** FUNCTIONS *****/

void callback(char *topic, byte *payload, unsigned int length) {
    Serial.print("Message arrived in topic: ");
    Serial.println(topic);

    String received_message;
    for (int i = 0; i < length; i++) {
        Serial.print((char) payload[i]);
        received_message += (char)payload[i];
    }
    Serial.println();

    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, received_message);
    if (error) {
        Serial.print("deserializeJson() failed: ");
        Serial.println(error.c_str());
        return;
    }

    String received_command = doc[MSG_CMD];
    interactWithReceivedCommand(MqttClient, received_command, MQTT_TOPIC_TO_SPEAK_ON, allow_to_publish);
}

/**** MAIN PROGRAM *****/

void setup() {
    Serial.begin(9600);
    setup_wifi(SSID, PASSWORD);
    setCACertForTLS(microcontrollerClientOverWifi, ROOT_CA); // enable this line and the the "certificate" code for secure connection

    configTime(GMT_OFFSET_SEC, DAYLIGHT_OFFSET_SEC, NTP_SERVER);

    MqttClient.setServer(MQTT_BROKER, MQTT_PORT);
    MqttClient.setCallback(callback);
}

void loop() {
    if (!MqttClient.connected()) {
        reconnect(MqttClient, MQTT_USERNAME, MQTT_PASSWORD, MQTT_TOPIC_TO_LISTEN_ON);
    }
    MqttClient.loop();

    unsigned long currentMillis = millis();
    if (currentMillis - previousMillis >= INTERVAL) {
        previousMillis = currentMillis;

        if (allow_to_publish) {
            publishValue(MqttClient, MQTT_TOPIC_TO_SPEAK_ON, 1, true);
        }
    }
}