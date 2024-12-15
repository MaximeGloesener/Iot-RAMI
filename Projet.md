## Explications du projet actuel

## Simulation de capteurs

#### Etape 1: lancer le backend

```bash
NODE_ENV=development npm run command docker:build
NODE_ENV=development npm run command docker:start
```

```bash
NODE_ENV=development npm run command docker:init-db
```

#### Etape 2: lancer le frontend

```bash
VITE_APP_ENV=dev npm run command dev
```

#### Etape 3: simuler le capteur

ALler dans le dossier "python-simulator-over-mqtt-master" et lancer la commande:

```bash
python3 ./mqttCliApp.py sensor hivemq
```

Sélectionner le topic suivant:

- pysimulator-esp32-ecg-topic

Et remplir les champs demandés (nombre de données par seconde et random ou pas)

#### Etape 4: aller dans interface
- Onglet "New session"
- Choix du capteur, cliquer sur offline et le statut devrait passer à online, ensuite commencer la session et visualisation des données dans l'interface




Ces étapes permettent de simuler le comportement d'un capteur et de récupérer des données dans l'interface.


Ce qu'il faut faire:
- Comprendre comment la simulation envoie les données dans l'interface et faire pareil mais avec des vraies données récupérées depuis l'arduino.


### Ecg

un stagiaire a déjà implémenté la com avec esp et interface ici:
[https://github.com/MaximeGloesener/Iot-RAMI/tree/main/sensors-over-mqtt-master/esp32-mqtt](https://github.com/MaximeGloesener/Iot-RAMI/tree/main/sensors-over-mqtt-master/esp32-mqtt)


Le code est là: [https://github.com/MaximeGloesener/Iot-RAMI/tree/main/sensors-over-mqtt-master/esp32-mqtt/rami1_esp32_AD8232_ecg](https://github.com/MaximeGloesener/Iot-RAMI/tree/main/sensors-over-mqtt-master/esp32-mqtt/rami1_esp32_AD8232_ecg)

Il permet de communiquer avec mqtt avec le serveur donc normalement ça devrait run.