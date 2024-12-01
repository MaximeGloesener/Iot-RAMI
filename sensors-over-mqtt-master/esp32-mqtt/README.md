## Utilisation d'Arduino pour l'esp32
### Prérequis pour la manipulation de l'esp32 au sein d'Arduino

Rappelez-vous, dans le README du dépot git, j'ai précisé qu'il fallait les librairies et le board adaptés.
Pour les fichiers situés dans cette arborescence, voici les libraires et le board adaptés:

#### 1. Les librairies

> **[UNE FOIS] Téléchargement des librairies** : Voici les librairies à installer:
- NTPClient (par Fabrice)
- PubSubClient (par Nick O'Leary)
- ArduinoJson (par Benoit Blanchon)

#### 2. Le board

> **[A CHAQUE CHANGEMENT DE MICROCONTROLEUR] Choix du board** : Vous possédez une esp32, vous allez donc devoir choisir le board "esp 32 Dev Module"

### Conseils supplémentaires

Dans le cadre de l'utilisation du capteur ecg avec l'esp32, il faut mettre en place la structure esp32-AD8232. Pour cela, référez vous au fichier pdf. Vous aurez besoin de mettre en place cette structure pour les fichiers:
- data_visualization_for_esp32.ino
- rami1_esp32_AD8232_ecg.ino

C'est pour ça que je vous conseille de commencer par le fichier only_esp32_sending_constants_over_mqtt.ino car vous aurez juste besoin de l'esp32 (ce fichier se contente d'envoyer des constantes au broker et permet l'interaction avec l'esp). Une fois que cela fonctionne et que vous vous êtes familiarisé avec Arduino, vous pouvez passer au reste.

#### 3. L'utilisation du fichier.ino (partie esp32)

NOTEZ BIEN, Arduino n'est pas très compatible avec git mais surtout lorsque vous ouvrez un fichier.ino. Vous devez nécessairement, y mettre les fichiers .hpp et .cpp dont vous avez besoin au sein du même dossier.

Pour les microcontrôleurs, il y a deux choses à retenir:

- Certaines parties sont communes à tous les microcontrôleurs, comme la capacité à se connecter au broker, y envoyer des messages, s'abonner aux topics, ainsi que la capacité à réagir aux commandes du serveur.
> **[À FAIRE UNE FOIS] Copiez les fichiers situés dans all-microcontrollers et mettez-les dans le dossier du fichier.ino que vous souhaitez utiliser**

- D'autres sont spécifiques à un microcontrôleur en particulier
> **[À FAIRE UNE FOIS] Copiez les fichiers situés à la racine du dossier portant le nom du microcontrôleur que vous souhaitez utiliser et mettez-les dans le dossier du fichier.ino que vous souhaitez utiliser**

Les fichiers copiés seront ignorés par le fichier .gitignore, les modifications doivent donc se faire dans les fichiers "originaux".
Le résultat après avoir fait le copié-coller devrait ressembler à :

![Illustration utilisation du fichier .ino](/images/arduino_utilisation_fichier_ino.jpeg)

=> Vous devez avoir 5 fichiers dans votre dossier pour pouvoir compiler et flasher.