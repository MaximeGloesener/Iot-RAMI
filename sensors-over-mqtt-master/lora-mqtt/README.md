## Utilisation d'Arduino pour la LoRa
### Prérequis pour la manipulation de la LoRa au sein d'Arduino

Rappelez-vous, dans le README du dépot git, j'ai précisé qu'il fallait les librairies et le board adaptés.
Pour les fichiers situés dans cette arborescence, voici les libraires et le board adaptés:


#### 1. Les librairies

> **[UNE FOIS] Téléchargement des librairies** : Voici les librairies à installer:
- PubSubClient (par Nick O'Leary, si pas déjà fait)
- ArduinoJson (par Benoit Blanchon, si pas déjà fait)
- AdaFruit DotStarMatrix (et les dépendances proposées par Arduino, faire: Installer toutes les dépendances)
- Adafruit_SSD1306 (et les dépendances proposées par Arduino, faire: Installer toutes les dépendances)

#### 2. Le board

> **[A CHAQUE CHANGEMENT DE MICROCONTROLEUR] Choix du board** : Vous possédez une LoRa version 2, vous allez donc devoir choisir le board "Heltec WiFi LoRa 32 (V2)"

#### 3. L'utilisation du fichier.ino (partie lora)

Cette partie est sensiblement la même que pour la partie 3 du README.md de l'ESP, donc référez-vous-y.