import { Request, Response } from "express";
import { pingSensor } from "@/controllers/mqttClientOverWebSocket"; // Adjust the path as necessary
import db from "@db/index";
import MqttServer from "@service/mqttServer";
import { RESPONSES } from "@/utils/mqttConstant";

jest.mock("mqtt", () => {
  const mMqttClient = {
    on: jest.fn(),
    end: jest.fn(),
    once: jest.fn(),
  };
  return {
    connect: jest.fn(() => mMqttClient),
  };
});

jest.mock("@db/index", () => ({
  Sensor: {
    findAll: jest.fn().mockResolvedValue([
      { id: "sensor1", topic: "topic1" },
      { id: "sensor2", topic: "topic2" },
    ]),
    findOne: jest.fn(),
  },
}));

jest.mock("@/service/mqttServer", () => ({
  getInstance: jest.fn().mockReturnValue({
    sendPingSignal: jest.fn(),
    endConnexionToBroker: jest.fn(),
  }),
}));

const { Sensor } = db as any;

describe("pingSensor Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    sendMock = jest.fn();
    res = {
      status: statusMock,
      json: jsonMock,
      send: sendMock,
    };
    req = {};
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    const mqttServer = await MqttServer.getInstance();
    await mqttServer.endConnexionToBroker();
  });

  it("should return 'Invalid sensor name' if sensor is not found", async () => {
    req.params = { sensorName: "nonexistentSensor" };
    Sensor.findOne.mockResolvedValue(null);

    await pingSensor(req as Request, res as Response);

    expect(Sensor.findOne).toHaveBeenCalledWith({ where: { name: "nonexistentSensor" } });
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ message: "Invalid sensor name" });
  });

  it("should return 'online' if the sensor responds with PONG", async () => {
    req.params = { sensorName: "existingSensor" };
    const sensorMock = { name: "existingSensor", topic: "test/topic" };
    Sensor.findOne.mockResolvedValue(sensorMock);
    const mqttInstance = await MqttServer.getInstance();
    (mqttInstance.sendPingSignal as jest.Mock).mockResolvedValue(RESPONSES.PONG);

    await pingSensor(req as Request, res as Response);

    expect(Sensor.findOne).toHaveBeenCalledWith({ where: { name: "existingSensor" } });
    expect(mqttInstance.sendPingSignal).toHaveBeenCalledWith("test/topic");
    expect(sendMock).toHaveBeenCalledWith({ message: "online" });
  });

  it("should return 'publishing' if the sensor responds with PONG_PUBLISHING", async () => {
    req.params = { sensorName: "existingSensor" };
    const sensorMock = { name: "existingSensor", topic: "test/topic" };
    Sensor.findOne.mockResolvedValue(sensorMock);
    const mqttInstance = await MqttServer.getInstance();
    (mqttInstance.sendPingSignal as jest.Mock).mockResolvedValue(RESPONSES.PONG_PUBLISHING);

    await pingSensor(req as Request, res as Response);

    expect(Sensor.findOne).toHaveBeenCalledWith({ where: { name: "existingSensor" } });
    expect(mqttInstance.sendPingSignal).toHaveBeenCalledWith("test/topic");
    expect(sendMock).toHaveBeenCalledWith({ message: "publishing" });
  });

  it("should return 'offline' if the sensor does not respond", async () => {
    req.params = { sensorName: "existingSensor" };
    const sensorMock = { name: "existingSensor", topic: "test/topic" };
    Sensor.findOne.mockResolvedValue(sensorMock);
    const mqttInstance = await MqttServer.getInstance();
    (mqttInstance.sendPingSignal as jest.Mock).mockResolvedValue(false);

    await pingSensor(req as Request, res as Response);

    expect(Sensor.findOne).toHaveBeenCalledWith({ where: { name: "existingSensor" } });
    expect(mqttInstance.sendPingSignal).toHaveBeenCalledWith("test/topic");
    expect(sendMock).toHaveBeenCalledWith({ message: "offline" });
  });

  it("should return 'unexpected error' if an error occurs", async () => {
    req.params = { sensorName: "existingSensor" };
    Sensor.findOne.mockRejectedValue(new Error("Database error"));

    await pingSensor(req as Request, res as Response);

    expect(Sensor.findOne).toHaveBeenCalledWith({ where: { name: "existingSensor" } });
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(sendMock).toHaveBeenCalledWith({ error: "unexpected error" });
  });
});
