**Readme version janvier 2025 – codes à utiliser pour faire fonctionner l’application.**

# Mettre le front-end : 

#npm install 

Créer un fichier .env.dev dans le dossier front-end et ajouter :

#VITE_APP_BACK_URL=http://localhost:3000/api/v1
#VITE_APP_TITLE=umons-sensor-backend (pre-prod)

Démarrer l’application :

#VITE_APP_ENV=dev npm run command dev

# Mettre le back-end:

#NODE_ENV=development npm run command docker:build
#NODE_ENV=development npm run command docker:start
#NODE_ENV=development npm run command docker:init-db

Attention : vérifier de bien avoir le fichier .env.development dans le dossier du back-end 

# Pour se connecter au front-end :

Identifiant : adriano@ig.umons.ac.be
Mot de passe : adriano@ig.umons.ac.be

Attention : les différents users se trouvent dans le dossier seeders du back-end mais l’identifiant = le mot de passe (ne pas utiliser le mot de passe répertorié dans le fichier). L’adresse mail adriano@ig.umons.ac.be est le mail avec tous les droits (le plus intéressant pour le développement). 

# Utilisation du simulateur (donc pour envoyer des données sans utiliser l'esp32)

Sans IDE Arduino, pour tester la connection back-end, front-end, utiliser le script python Iot-RAMI/python-simulator-over-mqtt-master/mqttCliApp.py 

Pour l’utiliser, installer les dépendances : 

#pip3 install -r requirements.txt 

Pour le démarrer : 

#python3 ./mqttCliApp.py sensor hivemq

Puis le terminal demandera le nom du topic, pour l’ecg, utiliser « pysimulator-esp32-ecg-topic ». 
Attendre un peu et le flux de données commencera.

# Utiliser l’interface : (avec ou sans esp32)

Se connecter. 
Aller dans New session. 
Les deux capteurs sont mis « offline ». Si le simulateur (ou l’esp32) est bien connecté, en cliquant sur le mot « offline » cela se modifiera en « online ». A ce moment-là, passer à l’étape 2 et le graphique sera visible à l’étape 3. Si tout se passe bien, le graphique s’affichera et bougera tout seul au fil des données reçues. 

# Pour visualiser sur l’interface avec l’esp32 :

Utiliser le fichier nommé rami1_esp32_AD8232_ecg.ino

Situé dans le dossier sensors-over-mqtt-master/esp32-mqtt/rami1_esp32_AD8232_ecg
Ajouter deux autres fichiers cpp et deux autres hpp dans le même dossier rami1_esp32_AD8232_ecg :
MQTTCommonOperations.cpp //disponible dans le dossier /all-microcontrollers
MQTTCommonOperations.hpp //disponible dans le dossier /all-microcontrollers
SpecificConstants.cpp //disponible dans le dossier /esp32-mqtt
SpecificConstants.hpp //disponible dans le dossier /esp32-mqtt
Il faut que les 5 fichiers soient dans le même dossier pour compiler 

Télécharger les librairies suivantes : 

- NTPClient (par Fabrice)
- PubSubClient (par Nick O'Leary)
- ArduinoJson (par Benoit Blanchon)

Sélectionner la bonne board : "esp 32 Dev Module"

Branchement : 

- Broche 3,3V du capteur AD8232 reliée à la broche 3,3V de l’ESP32.
- Broche GND relié à GND
- SDN du capteur AD8232 à D18 de l’ESP32.
- LO+ à D15 de l’ESP32.
- LO-  à D2 de l’ESP32.
- OUT relié à la broche D34 de l’ESP32.

Autre possibilité de branchement : 

- Broche 3,3V du capteur AD8232 reliée à la broche 3,3V de l’ESP32.
- Broche GND relié à GND
- SDN du capteur AD8232 à D18 de l’ESP32.
- LO+ à D25 de l’ESP32.
- LO-  à D26 de l’ESP32.
- OUT relié à la broche D32 de l’ESP32.

* Adapter les constantes du code Arduino en fonction du branchement choisi. 

Pour le code avec filtrage des hautes fréquences : 

Situé dans le dossier sensors-over-mqtt-master/esp32-mqtt/esp32&filtre

Le code s’appelle AvecFiltrage.ino
Besoin des 4 autres fichiers dans le dossier également. 

# Kafka

Back-end Kafka fonctionne, reste à le relier au front-end (le grahique ecg prend ses données dans PostgreSQL pour le moment). On peut vérifier son bon fonctionnement dans les logs du docker umons-sensor-dev. 

# Lien du github créé : https://github.com/MaximeGloesener/Iot-RAMI.git
