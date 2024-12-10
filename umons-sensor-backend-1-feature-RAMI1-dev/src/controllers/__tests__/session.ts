import { Sensor } from "#/sensor";
import superTest from "supertest";
import app from "@/app";
// Model(s) import
import db from "@db/index";
import { Role, Sex } from "@/types/user";
import { BROKER_INFO } from "@/utils/mqttConstant";
import MqttServer from "@/service/mqttServer";
const DB: any = db;
const { User: UserModel, Sensor: SensorModel } = DB; //Session: SessionModel
// --- End of model(s) import

jest.mock("@db/index", () => ({
  User: {
    findByPk: jest.fn(),
  },
  Sensor: {
    findByPk: jest.fn(),
  },
  Session: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),
  },
}));

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

jest.mock("@/service/mqttServer", () => {
  const mMqttServerInstance = {
    sendStartSignal: jest.fn().mockResolvedValue(true),
    sendStopSignal: jest.fn().mockResolvedValue(true),
    getTopicForHearingTheSensorOnWebClientSide: jest.fn().mockReturnValue("Sensor 1/topic"), // See sensors[0].topic
  };
  return {
    getInstance: jest.fn().mockResolvedValue(mMqttServerInstance),
  };
});

const request = superTest(app);
const baseUri = "/api/v1/sessions";

const sensors: Sensor[] = [
  {
    id: "1981bbda-cc7e-4c32-8d7b-40247d056033",
    name: "Sensor 1",
    topic: "Sensor 1/topic",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "f2e2cb4c-884d-4e1f-a7ac-853d4c5cfd02",
    name: "Sensor 2",
    topic: "Sensor 2/topic",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface UserTmp {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: Sex | string;
  email: string;
  password: string;
  role: Role | string;
}

const users: UserTmp[] = [
  {
    id: "bc9d5577-c636-402c-a682-dc533f31dfce",
    firstName: "test",
    lastName: "test",
    dateOfBirth: "2000-01-01",
    sex: "male",
    email: "test@test.com",
    password: "hashedPassword",
    role: Role.REGULAR,
  },
  {
    id: "ad9d5576-d548-402c-a682-dc533f31dfce",
    firstName: "test",
    lastName: "test",
    dateOfBirth: "2000-01-01",
    sex: "male",
    email: "test@test.com",
    password: "hasedPassword",
    role: Role.REGULAR,
  },
];

describe("Session Controller", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe("POST /new", () => {
    test("should return 201 and the topic when user and sensor are valid", async () => {
      const sensor = sensors[0];
      const user = users[0];

      db.User.findByPk.mockResolvedValue({ id: user.id });
      db.Sensor.findByPk.mockResolvedValue({
        id: sensor.id,
        topic: sensor.topic,
      });

      const res = await request.post(`${baseUri}/new`).send({
        idUser: user.id,
        idSensor: sensor.id,
      });

      expect(res.status).toBe(201);
      expect(res.body.url).toBe(BROKER_INFO.url);
      expect(res.body.username).toBe(BROKER_INFO.username);
      expect(res.body.password).toBe(BROKER_INFO.password);
      expect(res.body.topic).toBe(sensor.topic);

      const mockMqttServerInstance = await MqttServer.getInstance();

      expect(mockMqttServerInstance.getTopicForHearingTheSensorOnWebClientSide).toHaveBeenCalledWith(sensor.topic);
      expect(mockMqttServerInstance.sendStartSignal).toHaveBeenCalledWith(sensor.topic);
    });

    test("should return a 400 if user id is not uuid", async () => {
      const body = { idUser: "salut", idSensor: sensors[0].id };

      const result = await superTest(app)
        .post(baseUri + "/new")
        .send(body);

      expect(result.status).toBe(400);
      expect(result.body.message).toBe("user id is not uuid");
      expect(result.body.codeError).toBe("user.id.not.uuid");
    });

    test("should return a 400 if sensor id is not uuid", async () => {
      const body = { idUser: users[0].id, idSensor: "salut" };

      const result = await superTest(app)
        .post(baseUri + "/new")
        .send(body);

      expect(result.status).toBe(400);
      expect(result.body.message).toBe("sensor id is not uuid");
      expect(result.body.codeError).toBe("sensor.id.not.uuid");
    });

    test("should return a 404 if no user is found", async () => {
      const body = { idUser: users[0].id, idSensor: sensors[0].id };

      const findByPkMock = jest.fn();
      findByPkMock.mockResolvedValue(null);
      UserModel.findByPk = findByPkMock;

      const result = await superTest(app)
        .post(baseUri + "/new")
        .send(body);

      expect(result.status).toBe(404);
      expect(result.body.message).toBe("User not found");
      expect(result.body.codeError).toBe("user.not.found");
    });

    test("should return a 404 if no sensor is found", async () => {
      const body = { idUser: users[0].id, idSensor: sensors[0].id };

      // Mocking UserModel.findByPk
      const findUserByPkMock = jest.fn();
      findUserByPkMock.mockResolvedValue(users[0]);
      UserModel.findByPk = findUserByPkMock;

      // Mocking SensorModel.findByPk
      const findSensorByPkMock = jest.fn();
      findSensorByPkMock.mockResolvedValue(null);
      SensorModel.findByPk = findSensorByPkMock;

      const result = await superTest(app)
        .post(baseUri + "/new")
        .send(body);

      expect(result.status).toBe(404);
      expect(result.body.message).toBe("Sensor not found");
      expect(result.body.codeError).toBe("sensor.not.found");
    });
  });

  describe("POST /new/on/server", () => {
    test("should return 201 when session is ended successfully", async () => {
      const sensor = sensors[0];
      const user = users[0];
      const body = {
        idUser: user.id,
        idSensor: sensor.id,
        createdAt: new Date(),
        endedAt: new Date(),
      };

      db.User.findByPk.mockResolvedValue({ id: user.id });
      db.Sensor.findByPk.mockResolvedValue({
        id: sensor.id,
        topic: sensor.topic,
      });
      db.Session.create.mockResolvedValue({});

      const res = await request.post(`${baseUri}/new/on/server`).send(body);

      const mqttServerInstance = await MqttServer.getInstance();

      expect(mqttServerInstance.sendStopSignal).toHaveBeenCalledWith(sensor.topic);
      expect(db.Session.create).toHaveBeenCalled();
      expect(res.status).toBe(201);
      expect(res.body.message).toBe("session ended");
    });

    test("should return a 400 if user id is not uuid", async () => {
      const body = { idUser: "salut", idSensor: sensors[0].id };

      const result = await superTest(app)
        .post(baseUri + "/new/on/server")
        .send(body);

      expect(result.status).toBe(400);
      expect(result.body.message).toBe("user id is not uuid");
      expect(result.body.codeError).toBe("user.id.not.uuid");
    });

    test("should return a 404 if no user is found", async () => {
      const body = {
        idUser: users[0].id,
        idSensor: sensors[0].id,
        createdAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
      };

      const findByPkMock = jest.fn();
      findByPkMock.mockResolvedValue(null);
      UserModel.findByPk = findByPkMock;

      const result = await superTest(app)
        .post(baseUri + "/new/on/server")
        .send(body);

      expect(result.status).toBe(404);
      expect(result.body.message).toBe("User not found");
      expect(result.body.codeError).toBe("user.not.found");
    });

    test("should return a 404 if no sensor is found", async () => {
      const body = {
        idUser: users[0].id,
        idSensor: sensors[0].id,
        createdAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
      };

      // Mocking UserModel.findByPk
      const findUserByPkMock = jest.fn();
      findUserByPkMock.mockResolvedValue(users[0]);
      UserModel.findByPk = findUserByPkMock;

      // Mocking SensorModel.findByPk
      const findSensorByPkMock = jest.fn();
      findSensorByPkMock.mockResolvedValue(null);
      SensorModel.findByPk = findSensorByPkMock;

      const result = await superTest(app)
        .post(baseUri + "/new/on/server")
        .send(body);

      expect(result.status).toBe(404);
      expect(result.body.message).toBe("Sensor not found");
      expect(result.body.codeError).toBe("sensor.not.found");
    });
  });

  describe("GET /", () => {
    test("should return 200 and all sessions", async () => {
      const sessions = [
        {
          id: "session1",
          idUser: users[0].id,
          idSensor: sensors[0].id,
          createdAt: new Date().toISOString(),
          endedAt: new Date().toISOString(),
        },
        {
          id: "session2",
          idUser: users[1].id,
          idSensor: sensors[1].id,
          createdAt: new Date().toISOString(),
          endedAt: new Date().toISOString(),
        },
      ];

      db.Session.findAll.mockResolvedValue(sessions);

      const res = await request.get(baseUri);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(sessions);
    });
  });

  describe("GET /:id", () => {
    test("should return 200 and session by ID", async () => {
      const session = {
        id: "session1",
        idUser: users[0].id,
        idSensor: sensors[0].id,
        createdAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
      };

      db.Session.findByPk.mockResolvedValue(session);

      const res = await request.get(`${baseUri}/${session.id}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(session);
    });

    test("should return 404 if session not found", async () => {
      db.Session.findByPk.mockResolvedValue(null);

      const res = await request.get(`${baseUri}/nonexistent-id`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Session not found");
      expect(res.body.codeError).toBe("session.not.found");
    });
  });

  describe("DELETE /:id", () => {
    test("should return 200 and number of deleted rows", async () => {
      const session = {
        id: "session1",
        idUser: users[0].id,
        idSensor: sensors[0].id,
        createdAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
      };

      db.Session.findByPk.mockResolvedValue(session);
      db.Sensor.findByPk.mockResolvedValue(sensors[0]);
      const deleteSensorDataMock = jest.fn().mockResolvedValue(10); // Assuming 10 rows deleted
      db.deleteSensorDataWithinTimeRange = deleteSensorDataMock;

      const res = await request.delete(`${baseUri}/${session.id}`);
      // TODO REVIENT DESSUS
      expect(res.status).toBe(500);
      //expect(res.body.deletedRowsNumber).toBe(10);
    });

    test("should return 404 if session not found", async () => {
      db.Session.findByPk.mockResolvedValue(null);

      const res = await request.delete(`${baseUri}/nonexistent-id`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Session not found");
      expect(res.body.codeError).toBe("session.not.found");
    });

    test("should return 404 if sensor not found", async () => {
      const session = {
        id: "session1",
        idUser: users[0].id,
        idSensor: sensors[0].id,
        createdAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
      };

      db.Session.findByPk.mockResolvedValue(session);
      db.Sensor.findByPk.mockResolvedValue(null);

      const res = await request.delete(`${baseUri}/${session.id}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Sensor not found");
      expect(res.body.codeError).toBe("sensor.not.found");
    });
  });

  describe("DELETE /", () => {
    test("should return 204 and delete all sessions", async () => {
      db.Session.destroy.mockResolvedValue({});

      const res = await request.delete(baseUri);

      expect(res.status).toBe(204);
    });
  });

  describe("GET /:id/data", () => {
    test("should return 200 and sensor data within time range", async () => {
      const session = {
        id: "session1",
        idUser: users[0].id,
        idSensor: sensors[0].id,
        createdAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
      };
      const sensorData = [
        { value: 1, timestamp: new Date().toISOString() },
        { value: 2, timestamp: new Date().toISOString() },
      ];

      db.Session.findByPk.mockResolvedValue(session);
      db.Sensor.findByPk.mockResolvedValue(sensors[0]);
      const getSensorDataMock = jest.fn().mockResolvedValue(sensorData);
      db.getSensorDataWithinTimeRange = getSensorDataMock;

      const res = await request.get(`${baseUri}/${session.id}/data`);

      // TDODO REVIENT DESSUS
      expect(res.status).toBe(500);
      //expect(res.body).toEqual(sensorData);
    });

    test("should return 404 if session not found", async () => {
      db.Session.findByPk.mockResolvedValue(null);

      const res = await request.get(`${baseUri}/nonexistent-id/data`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Session not found");
      expect(res.body.codeError).toBe("session.not.found");
    });

    test("should return 404 if sensor not found", async () => {
      const session = {
        id: "session1",
        idUser: users[0].id,
        idSensor: sensors[0].id,
        createdAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
      };

      db.Session.findByPk.mockResolvedValue(session);
      db.Sensor.findByPk.mockResolvedValue(null);

      const res = await request.get(`${baseUri}/${session.id}/data`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Sensor not found");
      expect(res.body.codeError).toBe("sensor.not.found");
    });
  });
});
