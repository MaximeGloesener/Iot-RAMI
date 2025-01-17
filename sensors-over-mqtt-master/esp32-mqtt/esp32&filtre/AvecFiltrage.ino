#include "SpecificConstants.hpp"
#include "MQTTCommonOperations.hpp"

/**** esp32 sensor pin Settings *******/
const int pin_lo_minus = 2;
const int pin_lo_plus = 15;
const int sdn = 18;
const int analog_pin = 34;

WiFiClientSecure espClient;
PubSubClient client(espClient);

// Ajoutez un préfixe pour éviter le conflit
float baseline = 2000; // Baseline (à ajuster si nécessaire)
float filteredECG = 0;
float alpha = 0.1; // Coefficient du filtre (0.1 = filtrage doux)

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
    interactWithReceivedCommand(client, received_command, MQTT_TOPIC_TO_SPEAK_ON, allow_to_publish);
}

void setup() {
    Serial.begin(115200);
    pinMode(pin_lo_plus, INPUT);
    pinMode(pin_lo_minus, INPUT);
    pinMode(sdn ,OUTPUT);
    pinMode(analog_pin, INPUT);
    digitalWrite(sdn, HIGH);

    setup_wifi(SSID, PASSWORD);
    setCACertForTLS(espClient, ROOT_CA);  // Configuration pour TLS sécurisé
    configTime(GMT_OFFSET_SEC, DAYLIGHT_OFFSET_SEC, NTP_SERVER); // Configuration de l'horloge NTP

    client.setServer(MQTT_BROKER, MQTT_PORT);
    client.setCallback(callback);
}

void loop() {
    if (!client.connected()) {
        reconnect(client, MQTT_USERNAME, MQTT_PASSWORD, MQTT_TOPIC_TO_LISTEN_ON);
    }
    client.loop();

    if ((digitalRead(pin_lo_plus) == 1) || (digitalRead(pin_lo_minus) == 1)) {
        Serial.println("Electrodes déconnectées !");
    } else {
        unsigned long currentMillis = millis();
        if (currentMillis - previousMillis >= INTERVAL) { // Utilisez l'INTERVAL défini dans SpecificConstants.hpp
            previousMillis = currentMillis;

            if (allow_to_publish) {
                int rawValue = analogRead(analog_pin);

                // Retrait de la dérive DC
                float centeredValue = rawValue - baseline;

                // Filtrage passe-bas
                filteredECG = alpha * centeredValue + (1 - alpha) * filteredECG;

                Serial.print(" Send : ");
                Serial.println(filteredECG);
                publishValue(client, MQTT_TOPIC_TO_SPEAK_ON, filteredECG, true);
            }
        }
    }
}

