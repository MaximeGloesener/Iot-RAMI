#ifndef MQTT_COMMON_OPERATIONS
#define MQTT_COMMON_OPERATIONS

#include <WiFi.h>
#include <NTPClient.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <WiFiClientSecure.h>

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
// For example, the different microcontrollers are all capable of understanding the same commands and launching the same tyoe of answers
// That's because they all speak the same language (if this change, update this part...)

/****** Commands; NO PROGREM HERE, because we want the microcontroller to respond quickly to commands
(those are frequently compared to what we received from the servor)*******/
extern const char* COMMAND_PING;
extern const char* COMMAND_START;
extern const char* COMMAND_STOP;
// possible answers
extern const char* PING_RESPONSE;
extern const char* PING_RESPONSE_WHEN_ALREADY_PUBLISHING;
extern const char* START_RESPONSE;
extern const char* STOP_RESPONSE;
// type of the message
extern const char* MSG_TIMESTAMP;
extern const char* MSG_CMD;
extern const char* MSG_ANS;
extern const char* MSG_VALUE;

/****** NTP Client Settings; PROGREM because these settings are configured only once at the beginning *******/
extern const char* NTP_SERVER PROGMEM;
extern const long GMT_OFFSET_SEC;
extern const int DAYLIGHT_OFFSET_SEC;

/************************************ Function prototypes *************************************/
// Wifi and security
void setup_wifi(const char* ssid, const char* password);
void setCACertForTLS(WiFiClientSecure& client, const char* certificate);
// Mqtt (connexion, command reception and message publication)
void reconnect(PubSubClient& client, const char* mqtt_username, const char* mqtt_password, const char* topic);
void publishJSONMessage(PubSubClient& client, const char* topic, const char* json_buffer, const bool& retained=true);
long long getCurrentMicrosecondTimestampLong();
void publishAnswerToServerCommand(PubSubClient& client, const char* topic, const String& answer, const bool& retained=true);
void publishValue(PubSubClient& client, const char* topic, const float& value, const bool& retained=true);
void handlePingCommand(PubSubClient& client, const char* topic, const bool& allow_to_publish);
void handleStartCommand(PubSubClient& client, const char* topic, bool& allow_to_publish);
void handleStopCommand(PubSubClient& client, const char* topic, bool& allow_to_publish);
void interactWithReceivedCommand(PubSubClient& client, const String& received_command, const char* topic, bool& allow_to_publish);

#endif // MQTT_COMMON_OPERATIONS
