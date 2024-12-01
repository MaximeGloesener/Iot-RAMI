OS: Linux (Ubuntu /22.04 LTS)

# MQTT CLI Application
Cette application permet de simuler un capteur, un serveur, ou les deux en utilisant MQTT.

## Prérequis
Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre machine :
- Python 3.x
- pip (gestionnaire de paquets Python)


## Installation des dépendances
Pour installer les dépendances nécessaires pour cette application, suivez les étapes ci-dessous :

1. Clonez ce dépôt sur votre machine locale :
```bash
    git clone https://gitlab.ig.umons.ac.be/rami-1/python-simulator-over-mqtt.git
    cd votre-repo
```

2. Assurez-vous que vous êtes dans le répertoire du projet, puis installez les dépendances à l'aide de `pip` :
```bash
pip install -r requirements.txt
```

## Utilisation
Pour lancer l'application, utilisez la commande suivante dans le terminal (/!\ la partie ssh fonctionne uniquement sous Linux):

### Wifi
Il faut se souvenir que le wifi de l'umons bloque tout, vous ne POURREZ PAS VOUS CONNECTER AU BROKER via ce dernier.
Autrement dit, vous devez utiliser le partage de connexion de votre téléphone.

0. SI SOUS LINUX: Rendre le script executable
```bash
chmod +x run_mqttCliApp.sh
```
SOUS WINDOWS: Utiliser les commandes classiques commencant par "python3 ./mqttCliApp.py ..."

1. Pour obtenir des informations sur les conditions d'utilisations (notamment sur les modes et les brokers disponible):
```bash
./run_mqttCliApp.sh
python3 ./mqttCliApp.py
```

2. Pour simuler un capteur en utilisant un broker spécifique :
```bash
./run_mqttCliApp.sh sensor broker_name
python3 ./mqttCliApp.py sensor broker_name
```

3. Pour simuler un serveur :
```bash
./run_mqttCliApp.sh server broker_name
python3 ./mqttCliApp.py server broker_name
```

4. Pour tester la connexion au broker via WebSockets (coté client), ici le broker doit supporter websockets over mqtt !
Précision, ce mode est utile que si le sensor et le server ont été démarré avant, car ce mode ne fait "qu'écouter" comme le
ferait un client coté navigateur :
```bash
./run_mqttCliApp.sh client broker_name
python3 ./mqttCliApp.py client broker_name
```

## Utilisation avancée (et lien avec RAMI1)
En combinant les différents modes mentionnés précédemment, par exemple en simulant un capteur dans un premier terminal et un serveur dans un autre, vous pouvez simuler la communication entre ces parties telle qu'elle est implémentée par RAMI1.
=> Pour ce faire, sous Linux, vous pouvez utiliser:
```bash
./run_mqttCliApp.sh duo broker_name
```

# Toutes les fonctionnalités permettant la communication entre le capteur et le serveur ont été implémentées ici, avant d'être implémentées sur RAMI1.

En effet, tester un code sur de véritables cartes prend du temps. Il faut commencer par coder, puis compiler le code et enfin le flasher sur la carte. L'opération de flashage prend du temps et doit être répétée à chaque modification du code, même la plus minime. Pour la suite, prière d'implémenter les futures fonctionnalités du capteur ici. Si cela fonctionne, alors passez au codage sur Arduino. Cette approche nous permettra :

1. De gagner du temps lors du développement de fonctionnalités pour les capteurs.
2. De réaliser des tests avec des centaines de capteurs simulés, grâce au code mis à jour.
3. De faire des benchmarks de brokers.

## Recueil des données générées par le programme

1. Dans la configuration où vous avez ouvert un terminal pour le capteur et un autre pour le serveur, le serveur peut envoyer des commandes au capteur. Celles-ci vous seront reprécisées à chaque fois.

2. Une fois l'échange terminé, vous pouvez appuyer sur Ctrl+C pour quitter l'application. Vous aurez la possibilité de sauvegarder les échanges de valeurs et leurs temps (moment entre l'envoi d'un message du capteur sur le broker et sa réception par le serveur) dans un fichier Excel.

=> Dans le cas où vous seriez intéressés par ces données (benchmark de broker, analyse du temps de transmission...), PROCÉDEZ TOUJOURS DE CETTE FAÇON :

- 1) Ouvrir deux terminaux au sein du bon dossier. Sous linux, vous pouvez lancer la commande:
```bash
./run_mqttCliApp.sh duo broker_name
```
- 2) Sur l'un, lancer la commande pour simuler un capteur et sur l'autre, lancer la commande pour simuler un serveur.
- 3) Depuis le serveur, faites un ping. Si le capteur renvoie pong, la communication est établie.
- 4) Depuis le serveur, faites un start vous recevrez les valeurs du capteur simulé.
- 5) Depuis le serveur, faites un stop pour arrêter la transmission lorsque vous estimez que vous avez reçu suffisamment de valeurs.

POUR LA SAUVGARDE, L'ORDRE EST IMPORTANT
- 4) [Sauvegarde] Ctrl+C sur le terminal du capteur (car c'est l'expéditeur), puis Save:y
- 5) [Sauvegarde] Ctrl+C sur le terminal du serveur, puis Save:y
- 6) Vous trouverez l'ensemble des données correspondantes dans un fichier Excel situé dans le dossier results.

## Contribution

Vous pouvez soit ajouter un nouveau mode ou un nouveau broker.
1) Dans le cadre d'un nouveau broker, il vous suffit de compléter le fichier brokerInformator.py et d'y ajouter votre broker.
Attention, les informations de votre broker doivent être aussi précises que les précédentes et il faudra compléter la méthode get_broker.
Ainsi, il faudra renseigner : url, port, username, password, tls et ws. Vous pouvez vous inspirer des modèles précédents.

2) Dans le cadre d'un nouveau mode, vous aurez plus de travail. Mais il est peu probable que vous ayez à en ajouter un... Commencez par définir un nouveau mode dans constants.py et ajoutez ici, le nouveau mode. N'oubliez pas de compléter la méthode get_modes().
Normalement, ce mode devrait aussi hériter de mode.py. Vous pouvez créer un fichier pour ce nouveau mode. Ce fichier doit au moins
implémenter la méthode run et publish_message_according_to_mode !!! Enfin, complétez la méthode start de MqttCliApp pour prendre en compte ce nouveau mode.

DANS LES DEUX CAS, PENSEZ A COMPLETER LES GETTERS ...
