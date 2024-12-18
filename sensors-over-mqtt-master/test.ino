#include <WiFi.h> // Ajout de cette ligne
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

/**** Constantes WiFi et MQTT *****/
const char *SSID = "http://dkoop.be";
const char *PASSWORD = "dkoop2013";
const char *MQTT_BROKER = "b8ae34f9f9614007847e4a94196aa111.s1.eu.hivemq.cloud";
const char *MQTT_USERNAME = "sensorsOverHiveMQ";
const char *MQTT_PASSWORD = "KUvhSswNgi..7w4";
const int MQTT_PORT = 8883;
const char *MQTT_TOPIC_TO_SPEAK_ON = "pysimulator-esp32-ecg-topic/sensor";
const char *MQTT_TOPIC_TO_LISTEN_ON = "pysimulator-esp32-ecg-topic/server";

const char *ROOT_CA PROGMEM = R"EOF(
-----BEGIN CERTIFICATE-----
MIIFazCCA1OgAwIBAgIRAIIQz7DSQONZRGPgu2OCiwAwDQYJKoZIhvcNAQELBQAw
TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh
cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMTUwNjA0MTEwNDM4
WhcNMzUwNjA0MTEwNDM4WjBPMQswCQYDVQQGEwJVUzEpMCcGA1UEChMgSW50ZXJu
ZXQgU2VjdXJpdHkgUmVzZWFyY2ggR3JvdXAxFTATBgNVBAMTDElTUkcgUm9vdCBY
MTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAK3oJHP0FDfzm54rVygc
h77ct984kIxuPOZXoHj3dcKi/vVqbvYATyjb3miGbESTtrFj/RQSa78f0uoxmyF+
0TM8ukj13Xnfs7j/EvEhmkvBioZxaUpmZmyPfjxwv60pIgbz5MDmgK7iS4+3mX6U
A5/TR5d8mUgjU+g4rk8Kb4Mu0UlXjIB0ttov0DiNewNwIRt18jA8+o+u3dpjq+sW
T8KOEUt+zwvo/7V3LvSye0rgTBIlDHCNAymg4VMk7BPZ7hm/ELNKjD+Jo2FR3qyH
B5T0Y3HsLuJvW5iB4YlcNHlsdu87kGJ55tukmi8mxdAQ4Q7e2RCOFvu396j3x+UC
B5iPNgiV5+I3lg02dZ77DnKxHZu8A/lJBdiB3QW0KtZB6awBdpUKD9jf1b0SHzUv
KBds0pjBqAlkd25HN7rOrFleaJ1/ctaJxQZBKT5ZPt0m9STJEadao0xAH0ahmbWn
OlFuhjuefXKnEgV4We0+UXgVCwOPjdAvBbI+e0ocS3MFEvzG6uBQE3xDk3SzynTn
jh8BCNAw1FtxNrQHusEwMFxIt4I7mKZ9YIqioymCzLq9gwQbooMDQaHWBfEbwrbw
qHyGO0aoSCqI3Haadr8faqU9GY/rOPNk3sgrDQoo//fb4hVC1CLQJ13hef4Y53CI
rU7m2Ys6xt0nUW7/vGT1M0NPAgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNV
HRMBAf8EBTADAQH/MB0GA1UdDgQWBBR5tFnme7bl5AFzgAiIyBpY9umbbjANBgkq
hkiG9w0BAQsFAAOCAgEAVR9YqbyyqFDQDLHYGmkgJykIrGF1XIpu+ILlaS/V9lZL
ubhzEFnTIZd+50xx+7LSYK05qAvqFyFWhfFQDlnrzuBZ6brJFe+GnY+EgPbk6ZGQ
3BebYhtF8GaV0nxvwuo77x/Py9auJ/GpsMiu/X1+mvoiBOv/2X/qkSsisRcOj/KK
NFtY2PwByVS5uCbMiogziUwthDyC3+6WVwW6LLv3xLfHTjuCvjHIInNzktHCgKQ5
ORAzI4JMPJ+GslWYHb4phowim57iaztXOoJwTdwJx4nLCgdNbOhdjsnvzqvHu7Ur
TkXWStAmzOVyyghqpZXjFaH3pO3JLF+l+/+sKAIuvtd7u+Nxe5AW0wdeRlN8NwdC
jNPElpzVmbUq4JUagEiuTDkHzsxHpFKVK7q4+63SM1N95R1NbdWhscdCb+ZAJzVc
oyi3B43njTOQ5yOf+1CceWxG1bQVs5ZufpsMljq4Ui0/1lvh+wjChP4kqKOJ2qxq
4RgqsahDYVvTH9w7jXbyLeiNdd8XM2w9U/t7y0Ff/9yi0GE44Za4rF2LN9d11TPA
mRGunUHBcnWEvgJBQl9nJEiU0Zsnvgc/ubhPgXRR4Xq37Z0j4r7g1SgEEzwxA57d
emyPxgcYxn/eR44/KJ4EBs+lVDR3veyJm+kXQ99b21/+jh5Xos1AnX5iItreGCc=
-----END CERTIFICATE-----
)EOF";

/**** Paramètres de timing *****/
const unsigned int NUMBER_OF_VALUES_PER_SECOND = 1;
const long INTERVAL = 1000; // 1000ms = 1 seconde
unsigned long previousMillis = 0;

// Variables pour les valeurs aléatoires
const float MIN_VALUE = 0;
const float MAX_VALUE = 1000;

WiFiClientSecure espClient;
PubSubClient client(espClient);

/**** Fonction de publication des valeurs *****/
void publishValue(float value)
{
    DynamicJsonDocument doc(200);
    // Utiliser le temps en secondes avec décimales comme en Python
    float timestamp = millis() / 1000.0;
    doc["timestamp"] = timestamp;
    doc["value"] = value;

    char buffer[200];
    serializeJson(doc, buffer);
    client.publish(MQTT_TOPIC_TO_SPEAK_ON, buffer);
    Serial.print("Timestamp: ");
    Serial.print(timestamp);
    Serial.print(" - Valeur: ");
    Serial.println(value);
}

/**** Callback MQTT pour répondre au ping *****/
void callback(char *topic, byte *payload, unsigned int length)
{
    String received_message;
    for (int i = 0; i < length; i++)
    {
        received_message += (char)payload[i];
    }
    Serial.println("Message reçu: " + received_message);

    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, received_message);
    if (error)
        return;

    if (doc.containsKey("cmd") && doc["cmd"] == "ping")
    {
        DynamicJsonDocument response(200);
        response["timestamp"] = millis();
        response["ans"] = "pong"; // Changé de "pong" à "pong.publishing"

        char buffer[200];
        serializeJson(response, buffer);
        client.publish(MQTT_TOPIC_TO_SPEAK_ON, buffer);
        Serial.println("Réponse ping envoyée: pong");
    }
}

void setup_wifi()
{
    Serial.println("Connexion à WiFi...");
    WiFi.begin(SSID, PASSWORD);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nConnecté au WiFi");
}

void reconnect()
{
    while (!client.connected())
    {
        Serial.println("Tentative de connexion MQTT...");
        if (client.connect("ESP32Client", MQTT_USERNAME, MQTT_PASSWORD))
        {
            Serial.println("Connecté au broker MQTT");
            client.subscribe(MQTT_TOPIC_TO_LISTEN_ON);
        }
        else
        {
            delay(5000);
        }
    }
}

void setup()
{
    Serial.begin(115200);
    randomSeed(analogRead(0));

    setup_wifi();
    espClient.setCACert(ROOT_CA);
    client.setServer(MQTT_BROKER, MQTT_PORT);
    client.setCallback(callback);
}

void loop()
{
    if (!client.connected())
    {
        reconnect();
    }
    client.loop();

    unsigned long currentMillis = millis();
    if (currentMillis - previousMillis >= INTERVAL)
    {
        previousMillis = currentMillis;

        // Génération et envoi d'une valeur aléatoire
        float randomValue = random(MIN_VALUE, MAX_VALUE);
        publishValue(randomValue);
    }
}