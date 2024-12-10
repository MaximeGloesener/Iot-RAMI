import mqtt, { MqttClient } from "mqtt";
import {
  TOPICS,
  COMMANDS,
  RESPONSES,
  MESSAGE_FIELDS,
  BROKER_INFO,
} from "@/utils/mqttConstant";
import { createSensorData } from "@/controllers/sensorData";
// Model import
import db from "@db/index";
import { Sensor as SensorType } from "@/types/sensor";
import { BrokerInfo } from "@/types/mqttConstants";
import SensorOverMqtt from "@/service/sensorsOverMqtt";
const DB: any = db;
const { Sensor } = DB;
// --- end of model import

/**
 * MqttServer class responsible for managing MQTT connections, subscriptions,
 * and message handling for sensor communication.
 */
class MqttServer {
  private static instance: MqttServer | undefined;
  public mqttClient: MqttClient | undefined;
  private sensorsMap: Map<string, SensorOverMqtt> = new Map([]);
  private handleConnectBound = this.handleConnect.bind(this);
  private handleDisconnectBound = this.handleDisconnect.bind(this);
  private handleMessageReceivedFromSensorBound =
    this.handleMessageReceivedFromSensor.bind(this);
  private handleErrorBound = this.handleErrorMqtt.bind(this);

  // ------------------------ SINGLETON IMPLEMENTATION
  // Private constructor to prevent direct class instantiation (BUT WE DO NOT NEED IT !!)
  private constructor() {
    return;
  }

  /**
   * Returns the singleton instance of MqttServer. If the instance does not exist,
   * it creates one and connects to the MQTT broker.
   *
   * @return {Promise<MqttServer>} The singleton instance of MqttServer.
   */ public static async getInstance(): Promise<MqttServer> {
    if (MqttServer.instance === undefined) {
      MqttServer.instance = new MqttServer();
      await MqttServer.instance.connectBroker(BROKER_INFO);
    }
    return MqttServer.instance;
  }

  // ------------------------ BASIC MQTT METHODS (connexion, deconnexion, reconnexion)
  /**
   * Connects to the MQTT broker using the provided broker information.
   *
   * @param {BrokerInfo} BROKER_INFO - Information needed to connect to the broker.
   * @return {Promise<void>}
   */
  private async connectBroker(BROKER_INFO: BrokerInfo): Promise<void> {
    try {
      const connectOptions: mqtt.IClientOptions = {
        clientId: "RAMI1-Server",
        username: BROKER_INFO.username,
        password: BROKER_INFO.password,
        port: BROKER_INFO.port,
      };

      // ALL EVENTS will be dealt with in the MqttServer.ts file as well as the way the server publish MQTT messages
      await this.attachEventHandlers();

      this.mqttClient = mqtt.connect(
        `mqtts://${BROKER_INFO.url}`,
        connectOptions
      ); // USE mqtts = mqtt + tls
    } catch (error) {
      this.handleErrorMqtt(error as Error);
    }
  }

  /**
   * Ends the connection to the MQTT broker. (public version of disconnectBroker)

   * @return {Promise<void>}
   */
  public async endConnexionToBroker(): Promise<void> {
    await this.disconnectBroker();
  }

  /**
   * Reconnects to the MQTT broker after disconnecting.
   *
   * @return {Promise<void>}
   */
  private async reconnectBroker(): Promise<void> {
    await this.connectBroker(BROKER_INFO); // Attempt to reconnect after 5 seconds
  }

  /**
   * Ends the connection to the MQTT broker and removes event handlers.
   * NOTE THIS, when the broker disconnects, we reconnect it. here we remove
   * the event handler, this way, we do not react on the disconnection event !!
   *
   * @return {Promise<void>}
   */
  private async disconnectBroker(): Promise<void> {
    await this.removeEventHandlers();
    if (this.mqttClient) {
      await new Promise<void>((resolve, reject) =>
        this.mqttClient?.end(false, (err) => (err ? reject(err) : resolve()))
      );
    }
  }

  // ----------------------- HANDLE MQTT EVENTS AND ERROR --------------------------------

  /**
   * Manages MQTT event handlers by either attaching or removing them
   * depending on the action parameter.
   *
   * @param {"on" | "removeListener"} action - The action to perform: attach or remove handlers.
   */
  private async manageEventHandlers(action: "on" | "removeListener") {
    if (!this.mqttClient) return;

    const method =
      action === "on"
        ? this.mqttClient.on.bind(this.mqttClient)
        : this.mqttClient.removeListener.bind(this.mqttClient);

    method("connect", this.handleConnectBound);
    method("disconnect", this.handleDisconnectBound);
    method("message", this.handleMessageReceivedFromSensorBound);
    method("error", this.handleErrorBound);
  }

  /**
   * Attaches event handlers to the MQTT client.
   *
   * @return {Promise<void>}
   */
  private async attachEventHandlers() {
    await this.manageEventHandlers("on");
    //console.log("La gestion des événements MQTT a été activée!");
  }

  /**
   * Removes event handlers from the MQTT client.
   *
   * @return {Promise<void>}
   */
  private async removeEventHandlers() {
    await this.manageEventHandlers("removeListener");
    console.log("La gestions des événements MQTT a été désactivée!");
  }

  /**
   * Handles the MQTT connect event. Initializes sensors and subscribes to their topics.
   *
   * @return {Promise<void>}
   */
  private async handleConnect() {
    //console.log(`Connecté au broker à l'adresse mqtts://${BROKER_INFO.url}`);
    if (Sensor !== undefined) {
      // We check that our Sensor model is in our database !!!
      await this.initializeSensorsAndSubscribeToTheirTopic();
    }
  }

  /**
   * Handles the MQTT disconnect event. Unsubscribes all sensors and attempts to reconnect.
   *
   * @return {Promise<void>}
   */
  private async handleDisconnect() {
    this.removeAllSensorsAndUnsubscribeTheirTopic();
    this.removeEventHandlers();
    //console.log("Déconnexion du broker! => TENTATIVE DE RECONNEXION");
    await this.reconnectBroker();
  }

  /**
   * Handles incoming messages from sensors.
   *
   * @param {string} topic - The MQTT topic the message was received on.
   * @param {Buffer} message - The message payload.
   * @return {Promise<void>}
   */
  private async handleMessageReceivedFromSensor(
    topic: string,
    message: Buffer
  ) {
    // THE SERVER IS ONLY INTEREST IN THE VALUES SENT BY THE SENSOR, it does not care about the answers of the sensor
    // (only the mqtt Client on Websockets is intesrest in those)
    // THAT IS WHY HERE WE DO NOT DEAL WITH THE ANSWER CASE
    try {
      const messageString = message.toString();
      const parsedMessage = JSON.parse(messageString);
      //console.log(`NEW MESSAGE: ${messageString}`)

      const timestamp = parsedMessage[MESSAGE_FIELDS.TIMESTAMP];
      const value = parsedMessage[MESSAGE_FIELDS.VALUE];
      const sensorId = this.getSensorIdUsingTopic(topic);

      if (value !== undefined && !isNaN(Number(value)) && sensorId) {
        await createSensorData(sensorId, timestamp, parseFloat(value));
        //console.log(`Message received from ${topic}: ${messageString} => for ${sensorId} addeed in the database !`);
      }
    } catch (error) {
      this.handleErrorMqtt(error as Error);
    }
  }

  /**
   * Handles errors from the MQTT client.
   *
   * @param {Error} _error - The error object.
   */
  private handleErrorMqtt(_error: Error) {
    //console.log(error);
    //throw new ServerErrorException(error.message, "mqtt.error");
  }

  // ------------------------ BASIC MQTT METHODS 2 (topic subscription and unsubcription, message publication)

  /**
   * Subscribes to a given MQTT topic.
   *
   * @param {string} topic - The topic to subscribe to.
   * @return {Promise<void>}
   */
  private async subscribeTopic(topic: string): Promise<void> {
    try {
      if (this.mqttClient?.connected) {
        await new Promise<void>((resolve, reject) => {
          this.mqttClient?.subscribe(topic, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
        // console.log(`Server is subscribed to topic: ${topic}`);
      } else {
        throw new Error(
          "MQTT client is not connected but your are trying to subscribe a topic."
        );
      }
    } catch (err) {
      this.handleErrorMqtt(err as Error);
    }
  }

  /**
   * Unsubscribes from a given MQTT topic.
   *
   * @param {string} topic - The topic to unsubscribe from.
   * @return {Promise<void>}
   */
  private async unsubscribeTopic(topic: string): Promise<void> {
    try {
      if (this.mqttClient?.connected) {
        await new Promise<void>((resolve, reject) => {
          this.mqttClient?.unsubscribe(topic, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
          //console.log(`Server unsubscribed from topic: ${topic}`);
        });
      } else {
        throw new Error(
          "MQTT client is not connected but your are trying to unsubscribe a topic."
        );
      }
    } catch (err) {
      this.handleErrorMqtt(err as Error);
    }
  }

  /**
   * Publishes a message to a given MQTT topic.
   *
   * @param {string} topic - The topic to publish the message to.
   * @param {string} message - The message payload to publish.
   * @return {Promise<void>}
   */
  private async publishMessage(topic: string, message: string): Promise<void> {
    try {
      if (this.mqttClient?.connected) {
        await new Promise<void>((resolve, reject) => {
          this.mqttClient?.publish(topic, message, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
        //console.log(`Server published [topic: ${topic}, Message: ${message}]`);
      } else {
        throw new Error(
          "MQTT client is not connected but your are trying to publish a message."
        );
      }
    } catch (err) {
      this.handleErrorMqtt(err as Error);
    }
  }

  // ----------------------- HANDLE TOPIC DUPLICATION --------------------------
  // [ALL PRIVATE => the controllers does not have to know the topic duplication principle]

  /**
   * Generates the full topic name based on the base topic and the intended recipient.
   *
   * @param {string} topicFromDB - The base topic from the database.
   * @param {string} whoToHearFrom - Identifier of who to hear from (e.g., "sensor" or "server").
   * @return {string} The full topic name.
   */
  private getFullTopicName(topicFromDB: string, whoToHearFrom: string): string {
    return topicFromDB + whoToHearFrom;
  }

  /**
   * Gets the topic for receiving data from the sensor.
   *
   * @param {string} topicFromDB - The base topic from the database.
   * @return {string} The full topic name for receiving sensor data.
   */
  private getTopicForHearingTheSensor(topicFromDB: string): string {
    return this.getFullTopicName(topicFromDB, TOPICS.HEARING_THE_SENSOR);
  }

  /**
   * Gets the topic for sending data to the sensor from the server.
   *
   * @param {string} topicFromDB - The base topic from the database.
   * @return {string} The full topic name for sending data to the sensor.
   */
  private getTopicForHearingTheServer(topicFromDB: string): string {
    return this.getFullTopicName(topicFromDB, TOPICS.HEARING_THE_SERVER);
  }

  /**
   * Gets the topic for receiving data from the sensor on the client side (e.g., web client).
   *
   * @param {string} topicFromDB - The base topic from the database.
   * @return {string} The full topic name for receiving sensor data on the web client.
   */
  public getTopicForHearingTheSensorOnWebClientSide(
    topicFromDB: string
  ): string {
    return this.getTopicForHearingTheSensor(topicFromDB);
  }

  // ----------------------- MQTT Connector methods usage --------------------------

  /**
   * Subscribes the server to a topic for receiving data from the sensor.
   *
   * @param {string} topicFromDB - The base topic from the database.
   * @return {Promise<void>}
   */
  public async subscribeServer(topicFromDB: string) {
    await this.subscribeTopic(
      this.getTopicForHearingTheSensor(topicFromDB) // I want to hear what the sensor say
    );
  }

  /**
   * Unsubscribes the server from a topic for receiving data from the sensor.
   *
   * @param {string} topicFromDB - The base topic from the database.
   * @return {Promise<void>}
   */
  public async unsubscribeServer(topicFromDB: string) {
    await this.unsubscribeTopic(
      this.getTopicForHearingTheSensor(topicFromDB) // I do not want anymore to hear
    );
  }

  /**
   * Publishes a message to the sensor.
   *
   * @param {string} topicFromDB - The base topic from the database.
   * @param {string} message - The message payload to send to the sensor.
   * @return {Promise<void>}
   */
  private async publishMessageToSensor(topicFromDB: string, message: string) {
    await this.publishMessage(
      this.getTopicForHearingTheServer(topicFromDB), // I want to SPEAK to sensor, so I talk on my topic knowing it is listening
      message
    );
  }

  /**
   * Publishes a command (e.g., start, stop) to the sensor.
   *
   * @param {string} topicFromDB - The base topic from the database.
   * @param {string} command - The command to send to the sensor.
   * @return {Promise<void>}
   */
  public async publishCommandToSensor(topicFromDB: string, command: string) {
    const timestamp = Date.now() / 1000;
    const message = JSON.stringify({
      [MESSAGE_FIELDS.TIMESTAMP]: timestamp,
      [MESSAGE_FIELDS.CMD]: command,
    });
    await this.publishMessageToSensor(topicFromDB, message);
  }
  // ---------- HANDLE the way the server sends commands to the sensor and the way it received value from the sensors -------------

  /**
   * Sends the start signal to the sensor.
   *
   * @param {string} topicFromDB - The base topic from the database.
   * @return {Promise<void>}
   */
  public async sendStartSignal(topicFromDB: string) {
    await this.publishCommandToSensor(topicFromDB, COMMANDS.START);
  }

  /**
   * Sends the stop signal to the sensor.
   *
   * @param {string} topicFromDB - The base topic from the database.
   * @return {Promise<void>}
   */
  public async sendStopSignal(topicFromDB: string) {
    await this.publishCommandToSensor(topicFromDB, COMMANDS.STOP);
  }

  /**
   * Sends a ping signal to the sensor and waits for a response.
   *
   * @param {string} topicFromDB - The base topic from the database.
   * @return {Promise<string | false>} A promise that resolves with the response or false if no response is received.
   */
  public async sendPingSignal(topicFromDB: string): Promise<string | false> {
    return new Promise(async (resolve, reject) => {
      let responseReceived: string | null = null;

      const handleResponse = (response: string) => {
        responseReceived = response;
        cleanup();
        resolve(response);
      };

      const handleError = (err: Error) => {
        cleanup();
        reject(err);
      };

      const handleMessage = async (topic: string, message: Buffer) => {
        const messageString = message.toString();
        try {
          const parsedMessage = JSON.parse(messageString);
          const ans = parsedMessage[MESSAGE_FIELDS.ANS];
          if (this.getTopicForHearingTheSensor(topicFromDB) === topic) {
            if (ans === RESPONSES.PONG) {
              handleResponse(RESPONSES.PONG);
            } else if (ans === RESPONSES.PONG_PUBLISHING) {
              handleResponse(RESPONSES.PONG_PUBLISHING);
            }
          }
        } catch (error) {
          handleError(error as Error);
        }
      };

      const cleanup = () => {
        if (this.mqttClient) {
          this.mqttClient.removeListener("message", handleMessage);
        }
      };

      if (this.mqttClient) {
        this.mqttClient.once("message", handleMessage);
      }

      try {
        await this.publishCommandToSensor(topicFromDB, COMMANDS.PING);
      } catch (error) {
        handleError(error as Error);
      }

      setTimeout(() => {
        if (!responseReceived) {
          cleanup();
          resolve(false);
        }
      }, 500); // wait for 500 milliseconds
    });
  }

  // ---------- Method for the sensorsMap attribute -------------

  /**
   * Retrieves the sensor ID associated with the given topic.
   *
   * @param {string} topic - The topic associated with the sensor.
   * @return {string | undefined} The sensor ID or undefined if not found.
   */
  private getSensorIdUsingTopic(topic: string): string | undefined {
    const sensor = this.sensorsMap.get(topic);
    return sensor ? sensor.id : undefined;
  }

  /**
   * Adds a sensor to the sensorsMap and subscribes to its topic.
   *
   * @param {SensorOverMqtt} sensor - The sensor to add to the map and subscribe to its topic.
   * @return {Promise<void>}
   */
  private async addInSensorsMapAndSubItsTopic(sensor: SensorOverMqtt) {
    const topicDuplication = this.getTopicForHearingTheSensor(sensor.topic);
    this.sensorsMap.set(topicDuplication, sensor);
    await this.subscribeServer(sensor.topic);
  }

  /**
   * Removes a sensor from the sensorsMap and unsubscribes from its topic.
   *
   * @param {string} topicFromDB - The topic associated with the sensor to remove.
   * @return {Promise<void>}
   */
  private async removeFromSensorsMapAndUnsubItsTopic(topicFromDB: string) {
    const topicDuplication = this.getTopicForHearingTheSensor(topicFromDB);
    this.sensorsMap.delete(topicDuplication);
    await this.unsubscribeServer(topicFromDB);
  }

  /**
   * Removes all sensors from the sensorsMap and unsubscribes from all their topics.
   *
   * @return {Promise<void>}
   */
  private removeAllSensorsAndUnsubscribeTheirTopic() {
    const topics = Array.from(this.sensorsMap.keys());
    topics.forEach(async (topic) => {
      await this.removeFromSensorsMapAndUnsubItsTopic(topic);
    });
  }

  /**
   * Initializes the sensors from the database and subscribes to their topics.
   *
   * @return {Promise<void>}
   */
  private async initializeSensorsAndSubscribeToTheirTopic() {
    // Sensors fetch from database
    const sensors = await Sensor.findAll();
    if (sensors !== undefined && sensors.length > 0) {
      sensors.forEach(async (sensor: SensorType) => {
        const idSensor = sensor.id;
        const name = sensor.name;
        const topicFromDB = sensor.topic;
        await this.addInSensorsMapAndSubItsTopic(
          new SensorOverMqtt(idSensor, name, topicFromDB)
        );
      });
    }
  }
}

export default MqttServer;
