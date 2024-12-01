#include "MQTTCommonOperations.hpp"

/****** 
 * Usage of PROGMEM
 * -----------------
 * PROGMEM is used to store variables in flash memory (program memory) instead of SRAM. 
 * This is particularly useful on microcontrollers with limited SRAM.
 * To decide whether a string should be stored in PROGMEM, we consider its length and its access frequency.
 * - If the string is long and accessed rarely, it should be stored in PROGMEM.
 * - Else, it should remain in SRAM for performance reasons.
 ******/

// ----------------------------------- PART COMMON TO ALL MICROCONTROLLERS ---------------------------------------------------
// For example, the different microcontrollers are all capable of understanding the same commands and launching the same type of answers
// That's because they all speak the same language (if this change, update this part...)

/****** Commands; NO PROGREM HERE, because we want the microcontroller to respond quickly to commands
(those are frequently compared to what we received from the servor)*******/
const char* COMMAND_PING = "ping";
const char* COMMAND_START = "start";
const char* COMMAND_STOP = "stop";
// possible answers
const char* PING_RESPONSE = "pong";
const char* PING_RESPONSE_WHEN_ALREADY_PUBLISHING = "pong.publishing";
const char* START_RESPONSE = "start.publishing";
const char* STOP_RESPONSE = "stop.publishing";
// type of the message
const char* MSG_TIMESTAMP = "timestamp";
const char* MSG_CMD = "cmd";
const char* MSG_ANS = "ans";
const char* MSG_VALUE = "value";

/****** NTP Client Settings; PROGREM because these settings are configured only once at the beginning *******/
const char* NTP_SERVER PROGMEM = "pool.ntp.org";
const long GMT_OFFSET_SEC = 0;
const int DAYLIGHT_OFFSET_SEC = 3600;


/************************************ Function Implementations *************************************/
void setup_wifi(const char* ssid, const char* password) {
    delay(10);
    Serial.print("\nConnecting to ");
    Serial.println(ssid);

    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    randomSeed(micros());
    Serial.println("\nWiFi connected\nIP address: ");
    Serial.println(WiFi.localIP());
}

void setCACertForTLS(WiFiClientSecure& client, const char* certificate) {
    client.setCACert(certificate);
}

void reconnect(PubSubClient& client, const char* mqtt_username, const char* mqtt_password, const char* topic) {
    // Loop until we're reconnected
    while (!client.connected()) {
        Serial.print("Attempting MQTT connection...");
        // sensor id (you can change it to whatever you like, you may also add a parameter TODO)
        String clientId = "RAM1-Sensor-";
        // Attempt to connect
        if (client.connect(clientId.c_str(), mqtt_username, mqtt_password)) {
            Serial.println("connected");
            client.subscribe(topic); // subscribe the topics here
        } else {
            Serial.print("failed, rc=");
            Serial.print(client.state());
            Serial.println(" try again in 5 seconds");
            delay(5000);
        }
    }
}

void publishJSONMessage(PubSubClient& client, const char* topic, const char* json_buffer, const bool& retained) {
    if (client.publish(topic, json_buffer, retained)) {
        // Serial.printf(">>>>[%s]: sending %s\n", topic, json_buffer);
    }
}

long long getCurrentMicrosecondTimestampLong() {
    struct tm timeinfo;
    if (!getLocalTime(&timeinfo)) {
        Serial.println("Failed to obtain time");
        return -1;
    }

    time_t now;
    time(&now);
    long us = micros() % 1000000;
    long long timestamp = static_cast<long long>(now) * 1000000LL + us;

    return timestamp;
}

void publishAnswerToServerCommand(PubSubClient& client, const char* topic, const String& answer, const bool& retained) {
    long long timestamp_buffer = getCurrentMicrosecondTimestampLong();
    if (timestamp_buffer < 0) {
        return;
    }

    DynamicJsonDocument doc(1024);
    doc[MSG_TIMESTAMP] = timestamp_buffer;
    doc[MSG_ANS] = answer;

    char json_buffer[512];
    serializeJson(doc, json_buffer);

    publishJSONMessage(client, topic, json_buffer, retained);
}

void publishValue(PubSubClient& client, const char* topic, const float& value, const bool& retained) {
    long long timestamp_buffer = getCurrentMicrosecondTimestampLong();
    if (timestamp_buffer < 0) {
        return;
    }

    DynamicJsonDocument doc(1024);
    doc[MSG_TIMESTAMP] = timestamp_buffer;
    doc[MSG_VALUE] = value;

    char json_buffer[512];
    serializeJson(doc, json_buffer);

    publishJSONMessage(client, topic, json_buffer, retained);
}

void handlePingCommand(PubSubClient& client, const char* topic, const bool& allow_to_publish) {
    if (allow_to_publish) {
        publishAnswerToServerCommand(client, topic, PING_RESPONSE_WHEN_ALREADY_PUBLISHING);
    } else {
        publishAnswerToServerCommand(client, topic, PING_RESPONSE);
    }
}

void handleStartCommand(PubSubClient& client, const char* topic, bool& allow_to_publish) {
    publishAnswerToServerCommand(client, topic, START_RESPONSE);
    allow_to_publish = true;
}

void handleStopCommand(PubSubClient& client, const char* topic, bool& allow_to_publish) {
    allow_to_publish = false;
    publishAnswerToServerCommand(client, topic, STOP_RESPONSE);
}

void interactWithReceivedCommand(PubSubClient& client, const String& received_command, const char* topic, bool& allow_to_publish) {
    if (received_command == COMMAND_PING) {
        handlePingCommand(client, topic, allow_to_publish);
    } else if (received_command == COMMAND_START) {
        handleStartCommand(client, topic, allow_to_publish);
    } else if (received_command == COMMAND_STOP) {
        handleStopCommand(client, topic, allow_to_publish);
    }
}