import MqttServer from "@/service/mqttServer";
import { COMMANDS, TOPICS } from "@/utils/mqttConstant";

jest.mock("mqtt");

describe("MqttServer", () => {
  let instance: MqttServer;

  beforeAll(async () => {
    instance = await MqttServer.getInstance();
  });

  afterAll(async () => {
    await instance.endConnexionToBroker();
  });

  it("should create an instance of MqttServer", async () => {
    expect(instance).toBeInstanceOf(MqttServer);
  });

  it("should create a singleton instance", async () => {
    const instance1 = await MqttServer.getInstance();
    const instance2 = await MqttServer.getInstance();
    expect(instance1).toBe(instance2);
  });

  it("should return the correct topic for hearing the sensor on web client side", async () => {
    const topicFromDB = "test/topic";
    const expectedFullTopic = `${topicFromDB}${TOPICS.HEARING_THE_SENSOR}`;

    const result = instance.getTopicForHearingTheSensorOnWebClientSide(topicFromDB);

    expect(result).toBe(expectedFullTopic);
  });

  it("should subscribe to the correct topic", async () => {
    const topicFromDB = "test/topic";
    const fullTopic = instance.getTopicForHearingTheSensorOnWebClientSide(topicFromDB);

    const subscribeTopicSpy = jest.spyOn(instance as any, "subscribeTopic").mockResolvedValue(undefined);

    await instance.subscribeServer(topicFromDB);

    expect(subscribeTopicSpy).toHaveBeenCalledWith(fullTopic);

    subscribeTopicSpy.mockRestore();
  });

  it("should unsubscribe from the correct topic", async () => {
    const topicFromDB = "test/topic";
    const fullTopic = instance.getTopicForHearingTheSensorOnWebClientSide(topicFromDB);

    const unsubscribeTopicSpy = jest.spyOn(instance as any, "unsubscribeTopic").mockResolvedValue(undefined);

    await instance.unsubscribeServer(topicFromDB);

    expect(unsubscribeTopicSpy).toHaveBeenCalledWith(fullTopic);

    unsubscribeTopicSpy.mockRestore();
  });

  /* Since publishMessageToSensor is private, we can not do this test anymore !
  it("should publish a message to the correct topic", async () => {
    const topicFromDB = "test/topic";
    const message = "test message";
    const fullTopic = `${topicFromDB}${TOPICS.HEARING_THE_SERVER}`;

    const publishMessageSpy = jest.spyOn(instance as any, "publishMessage").mockResolvedValue(undefined);

    await instance.publishMessageToSensor(topicFromDB, message);

    expect(publishMessageSpy).toHaveBeenCalledWith(fullTopic, message);

    publishMessageSpy.mockRestore();
  });*/

  it("should send start signal to sensor", async () => {
    const topicFromDB = "test/topic";

    const publishCommandToSensorSpy = jest.spyOn(instance as any, "publishCommandToSensor").mockResolvedValue(undefined);

    await instance.sendStartSignal(topicFromDB);

    expect(publishCommandToSensorSpy).toHaveBeenCalledWith(topicFromDB, COMMANDS.START);

    publishCommandToSensorSpy.mockRestore();
  });

  it("should send stop signal to sensor", async () => {
    const topicFromDB = "test/topic";

    const publishCommandToSensorSpy = jest.spyOn(instance as any, "publishCommandToSensor").mockResolvedValue(undefined);

    await instance.sendStopSignal(topicFromDB);

    expect(publishCommandToSensorSpy).toHaveBeenCalledWith(topicFromDB, COMMANDS.STOP);

    publishCommandToSensorSpy.mockRestore();
  });
});
