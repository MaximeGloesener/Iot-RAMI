import { Sensor } from "#/sensor";
// Model(s) import
import db from "@db/index";
const DB: any = db;
const { Sensor: SensorModel, UserSensorAccess } = DB;
// --- End of model(s) import
import app from "@/app";
import superTest from "supertest";
import {
  checkId,
  checkIfNameExists,
  checkName,
  checkIfTopicExists,
  checkTopic,
} from "@controllers/sensor";
import { BadRequestException, ServerErrorException } from "@utils/exceptions";
import { Role } from "#/user";
import jwt from "jsonwebtoken";

jest.mock("@db/index", () => ({
  // Due to the establishment of associations with RAMI1, the models are now imported from the db
  // Since the models all appear in the database from @db/index, we ONLY MAKE one mock from the db!
  Sensor: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Measurement: {
    hasOne: jest.fn()
  },
  User: {
    hasOne: jest.fn()
  },
  UserSensorAccess: {
    findAll: jest.fn(),
    hasOne: jest.fn()
  }
}));

jest.mock("jsonwebtoken", () => {
  return {
    verify: jest.fn().mockImplementation(() => {
      return {
        id: "id-1",
        role: "regular"
      };
    }),
    decode: jest.fn().mockImplementation(() => {
      return {
        id: "id-1",
        role: "regular"
      };
    })
  };
});

const baseUri = "/api/v1/sensors";

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

describe("Auxiliary functions", () => {
  describe("checkName", () => {
    test("should throws BadRequestException when name is not provided", () => {
      expect(() => checkName("")).toThrowError(BadRequestException);
      expect(() => checkName("")).toThrowError("Name is required");
    });

    test("should throws BadRequestException when name is too long", () => {
      const longName = "a".repeat(256);
      expect(() => checkName(longName)).toThrowError(BadRequestException);
      expect(() => checkName(longName)).toThrowError("Name is too long");
    });

    test("should throws BadRequestException when name is too short", () => {
      expect(() => checkName("ab")).toThrowError(BadRequestException);
      expect(() => checkName("ab")).toThrowError("Name is too short");
    });

    test("should does not throw any error when name is valid", () => {
      expect(() => checkName("Valid Name")).not.toThrow();
    });
  });
  describe("checkTopic", () => {
    test("should throws BadRequestException when topic is not provided", () => {
      expect(() => checkTopic("")).toThrowError(BadRequestException);
      expect(() => checkTopic("")).toThrowError("Topic is required");
    });

    test("should throws BadRequestException when topic is too long", () => {
      const longTopic = "a".repeat(256);
      expect(() => checkTopic(longTopic)).toThrowError(BadRequestException);
      expect(() => checkTopic(longTopic)).toThrowError("Topic is too long");
    });

    test("should throws BadRequestException when topic is too short", () => {
      expect(() => checkTopic("ab")).toThrowError(BadRequestException);
      expect(() => checkTopic("ab")).toThrowError("Topic is too short");
    });

    test("should does not throw any error when topic is valid", () => {
      expect(() => checkTopic("Valid Name")).not.toThrow();
    });
  });
  describe("checkId", () => {
    test(" shouldthrows BadRequestException when id is not provided", () => {
      expect(() => checkId("")).toThrowError(BadRequestException);
      expect(() => checkId("")).toThrowError("Id is required");
    });

    test("should throws BadRequestException when id length is not 36", () => {
      expect(() => checkId("12345")).toThrowError(BadRequestException);
      expect(() => checkId("12345")).toThrowError("Id must be a valid uuid");
    });

    test("should does not throw any error when id is valid", () => {
      expect(() =>
        checkId("a4b43db2-ec5c-45a9-8b2e-1f4e2ccdf61f")
      ).not.toThrow();
    });
  });
  describe("checkIfNameExists", () => {
    test("should throws BadRequestException when name already exists", async () => {
      const findOneMock = jest.fn();
      findOneMock.mockResolvedValue(sensors[0]);
      SensorModel.findOne = findOneMock;

      await expect(checkIfNameExists("Sensor 1")).rejects.toEqual(
        new BadRequestException(
          "Sensor already exists",
          "sensor.already.exists"
        )
      );
    });
    test("should does not throw any error when name does not exists", async () => {
      const findOneMock = jest.fn();
      findOneMock.mockResolvedValue(null);
      SensorModel.findOne = findOneMock;

      await expect(checkIfNameExists("Sensor 1")).resolves.not.toThrow();
    });
    test("should throws a server error when findOne throw an error", async () => {
      const findOneMock = jest.fn();
      findOneMock.mockRejectedValue(new Error("Error"));
      SensorModel.findOne = findOneMock;

      await expect(checkIfNameExists("Sensor 1")).rejects.toEqual(
        new ServerErrorException("Server error", "server.error")
      );
    });
  });
  describe("checkIfTopicExists", () => {
    test("should throw BadRequestException when topic already exists", async () => {
      const findOneMock = jest.fn();
      findOneMock.mockResolvedValue({ id: 1, topic: "Existing Topic" });
      SensorModel.findOne = findOneMock;

      await expect(checkIfTopicExists("Existing Topic")).rejects.toEqual(
        new BadRequestException("Topic already exists", "topic.already.exists")
      );
    });

    test("should not throw any error when topic does not exist", async () => {
      const findOneMock = jest.fn();
      findOneMock.mockResolvedValue(null);
      SensorModel.findOne = findOneMock;

      await expect(checkIfTopicExists("New Topic")).resolves.not.toThrow();
    });

    test("should throw a server error when findOne throws an error", async () => {
      const findOneMock = jest.fn();
      findOneMock.mockRejectedValue(new Error("Error"));
      SensorModel.findOne = findOneMock;

      await expect(checkIfTopicExists("Any Topic")).rejects.toEqual(
        new ServerErrorException("Server error", "server.error")
      );
    });
  });
});

describe("Sensor controller", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe("GET /", () => {
    test("should return a 200 with all sensors if no id is provided", async () => {
      const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.ADMIN });
      jwt.verify = verifyMock;
      jwt.decode = verifyMock;

      const findAllMock = jest.fn();
      findAllMock.mockResolvedValue(sensors);
      SensorModel.findAll = findAllMock;

      const result = await superTest(app)
        .get(baseUri)
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(200);
      expect(result.body).toEqual(sensors);
    });

    test("should return a 200 with the sensor with the associated id", async () => {
      const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.ADMIN });
      jwt.verify = verifyMock;
      jwt.decode = verifyMock;

      const findByPkMock = jest.fn();
      findByPkMock.mockResolvedValue(sensors[0]);
      SensorModel.findByPk = findByPkMock;

      const result = await superTest(app)
        .get(baseUri + "/1981bbda-cc7e-4c32-8d7b-40247d056033")
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(200);
      expect(result.body).toEqual(sensors[0]);
    });

    test("should return a 200 with the sensor with the associated name", async () => {
      const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.ADMIN });
      jwt.verify = verifyMock;
      jwt.decode = verifyMock;

      const findOneMock = jest.fn();
      findOneMock.mockResolvedValue(sensors[0]);
      SensorModel.findOne = findOneMock;

      const result = await superTest(app)
        .get(baseUri + "?name=Sensor1")
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(200);
      expect(result.body).toEqual(sensors[0]);
    });

    test("should return a 404 if no sensor are found", async () => {
      const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.ADMIN });
      jwt.verify = verifyMock;
      jwt.decode = verifyMock;

      const findByPkMock = jest.fn();
      findByPkMock.mockResolvedValue(null);
      SensorModel.findByPk = findByPkMock;

      const result = await superTest(app)
        .get(baseUri + "/1981bbda-cc7e-4c32-8d7b-40247d056033")
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(404);
      expect(result.body.message).toBe("Sensor not found");
      expect(result.body.codeError).toBe("sensor.not.found");
    });

    test("should return a 500 if findByPk or findAll throw an error", async () => {
      const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.ADMIN });
      jwt.verify = verifyMock;
      jwt.decode = verifyMock;

      const findAllMock = jest.fn();
      findAllMock.mockRejectedValue(new Error("Error"));
      SensorModel.findAll = findAllMock;

      const result = await superTest(app)
        .get(baseUri)
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(500);
      expect(result.body.message).toBe("Server error");
      expect(result.body.codeError).toBe("server.error");
    });

    test("should return a 400 if decode return is null", async () => {
      const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.ADMIN });
      jwt.verify = verifyMock;
      const decodeMock = jest.fn();
      decodeMock.mockReturnValue(null);
      jwt.decode = decodeMock;

      const findAllMock = jest.fn();
      findAllMock.mockResolvedValue(sensors);
      SensorModel.findAll = findAllMock;

      const result = await superTest(app)
        .get(baseUri)
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(400);
      expect(result.body.message).toBe("Invalid token !");
      expect(result.body.codeError).toBe("auth.token.invalid");
    });

    test("should return a 500 if decode throw an error", async () => {
      const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.ADMIN });
      jwt.verify = verifyMock;
      const decodeMock = jest.fn();
      decodeMock.mockRejectedValue(new Error());
      jwt.decode = decodeMock;

      const findAllMock = jest.fn();
      findAllMock.mockResolvedValue(sensors);
      SensorModel.findAll = findAllMock;

      const result = await superTest(app)
        .get(baseUri)
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(500);
      expect(result.body.message).toBe("Server error");
      expect(result.body.codeError).toBe("server.error");
    });

    test("should return a 404 if no sensors are found", async () => {
      const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.REGULAR });
      jwt.verify = verifyMock;
      jwt.decode = verifyMock;

      const findAllMock = jest.fn();
      findAllMock.mockResolvedValue(sensors);
      SensorModel.findAll = findAllMock;

      const result = await superTest(app)
        .get(baseUri)
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(404);
      expect(result.body.message).toBe("No sensors found !");
      expect(result.body.codeError).toBe("measurement.sensor.not.found");
    });

    test("should return a 403 if user don't have access to any sensor", async () => {
      const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.REGULAR });
      jwt.verify = verifyMock;
      jwt.decode = verifyMock;

      const findAllMock = jest.fn();
      findAllMock.mockResolvedValue([]);
      SensorModel.findAll = findAllMock;
      UserSensorAccess.findAll = findAllMock;

      const result = await superTest(app)
        .get(baseUri)
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(403);
      expect(result.body.message).toBe("You don't have access to any sensor");
      expect(result.body.codeError).toBe("sensor.not.found");
    });
  });

  describe("POST /", () => {
    test("should return a 201 with the created sensor", async () => {
      const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.ADMIN });
      jwt.verify = verifyMock;
      jwt.decode = verifyMock;

      const createMock = jest.fn();
      createMock.mockResolvedValue(sensors[0]);
      SensorModel.create = createMock;

      const findOneMock = jest.fn();
      findOneMock.mockResolvedValue(null);
      SensorModel.findOne = findOneMock;

      const body = { name: sensors[0].name, topic: sensors[0].topic };

      const result = await superTest(app)
        .post(baseUri)
        .send(body)
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(201);
      expect(result.body).toEqual(sensors[0]);
    });

    test("should return a 400 if name is not provided", async () => {
      const body = { name: "", topic: "topic" };
      /*const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.ADMIN });
      jwt.verify = verifyMock;
      jwt.decode = verifyMock;

      const body = { name: "" };*/

      const result = await superTest(app)
        .post(baseUri)
        .send(body)
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(400);
      expect(result.body.message).toBe("Name is required");
      expect(result.body.codeError).toBe("sensor.name.required");
    });

    test("should return a 400 if name already exists", async () => {
      const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.ADMIN });
      jwt.verify = verifyMock;
      jwt.decode = verifyMock;

      const findOneMock = jest.fn();
      findOneMock.mockResolvedValue(sensors[0]);
      SensorModel.findOne = findOneMock;

      const body = { name: sensors[0].name, topic: sensors[0].topic };

      const result = await superTest(app)
        .post(baseUri)
        .send(body)
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(400);
      expect(result.body.message).toBe("Sensor already exists");
      expect(result.body.codeError).toBe("sensor.already.exists");
    });

    test("should return a 500 if the research of existing name throw an servor error", async () => {
      const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.ADMIN });
      jwt.verify = verifyMock;
      jwt.decode = verifyMock;

      const findOneMock = jest.fn();
      findOneMock.mockRejectedValue(new Error("Error"));
      SensorModel.findOne = findOneMock;

      const body = { name: sensors[0].name, topic: sensors[0].topic };

      const result = await superTest(app).post(baseUri).send(body);

      expect(result.status).toBe(500);
      expect(result.body.message).toBe("Server error");
      expect(result.body.codeError).toBe("server.error");
    });
    test("should return a 400 if topic is not provided", async () => {
      const body = { name: "Sensor 1", topic: "" };

      const result = await superTest(app).post(baseUri).send(body);

      expect(result.status).toBe(400);
      expect(result.body.message).toBe("Topic is required");
      expect(result.body.codeError).toBe("topic.name.required");
    });
    test("should return a 400 if topic already exists", async () => {
      const findOneMock = jest
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(sensors[0]);
      SensorModel.findOne = findOneMock;

      const body = { name: "newSensorName", topic: sensors[0].topic };

      const result = await superTest(app).post(baseUri).send(body);

      expect(result.status).toBe(400);
      expect(result.body.message).toBe("Topic already exists");
      expect(result.body.codeError).toBe("topic.already.exists");
    });
    test("should return a 500 if the research of existing topic throws a server error", async () => {
      const findOneMock = jest.fn();
      findOneMock.mockRejectedValue(new Error("Error"));
      SensorModel.findOne = findOneMock;

      const body = { name: "Sensor 1", topic: sensors[0].topic };

      const result = await superTest(app)
        .post(baseUri)
        .send(body)
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(500);
      expect(result.body.message).toBe("Server error");
      expect(result.body.codeError).toBe("server.error");
    });

    test("should return a 500 if create does not return a sensor", async () => {
      const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.ADMIN });
      jwt.verify = verifyMock;
      jwt.decode = verifyMock;

      const createMock = jest.fn();
      createMock.mockResolvedValue(null);
      SensorModel.create = createMock;

      const findOneMock = jest.fn();
      findOneMock.mockResolvedValue(null);
      SensorModel.findOne = findOneMock;

      const body = { name: sensors[0].name, topic: sensors[0].topic };

      const result = await superTest(app)
        .post(baseUri)
        .send(body)
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(500);
      expect(result.body.message).toBe("Server error");
      expect(result.body.codeError).toBe("server.error");
    });

    test("should return a 500 if create throw an error", async () => {
      const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.ADMIN });
      jwt.verify = verifyMock;
      jwt.decode = verifyMock;

      const createMock = jest.fn();
      createMock.mockRejectedValue(new Error("Error"));
      SensorModel.create = createMock;

      const findOneMock = jest.fn();
      findOneMock.mockResolvedValue(null);
      SensorModel.findOne = findOneMock;

      const body = { name: sensors[0].name, topic: sensors[0].topic };

      const result = await superTest(app)
        .post(baseUri)
        .send(body)
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(500);
      expect(result.body.message).toBe("Server error");
      expect(result.body.codeError).toBe("server.error");
    });
  });

  describe("PUT /", () => {
    test("should return a 200 with the updated sensor", async () => {
      const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.ADMIN });
      jwt.verify = verifyMock;
      jwt.decode = verifyMock;

      const updateMock = jest.fn();
      updateMock.mockResolvedValue(sensors[0]);
      SensorModel.update = updateMock;

      const body = { name: sensors[0].name, topic: sensors[0].topic };

      const result = await superTest(app)
        .put(baseUri + "/" + sensors[0].id)
        .send(body)
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(200);
      expect(result.body).toEqual(sensors[0]);
    });

    test("should return a 400 if name is not valid", async () => {
      const body = { name: "", topic: "topic" };
      /*const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.ADMIN });
      jwt.verify = verifyMock;
      jwt.decode = verifyMock;

      const body = { name: "" };*/

      const result = await superTest(app)
        .put(baseUri + "/" + sensors[0].id)
        .send(body)
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(400);
      expect(result.body.message).toBe("Name is required");
      expect(result.body.codeError).toBe("sensor.name.required");
    });
    test("should return a 400 if name is not valid", async () => {
      const body = { name: "name", topic: "" };

      const result = await superTest(app)
        .put(baseUri + "/" + sensors[0].id)
        .send(body);

      expect(result.status).toBe(400);
      expect(result.body.message).toBe("Topic is required");
      expect(result.body.codeError).toBe("topic.name.required");
    });
    test("should return a 400 if id is not valid", async () => {
      const body = { name: sensors[0].name, topic: sensors[0].topic };

    /*test("should return a 400 if id is not valid", async () => {
      const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.ADMIN });
      jwt.verify = verifyMock;
      jwt.decode = verifyMock;

      const body = { name: sensors[0].name };*/

      const result = await superTest(app)
        .put(baseUri + "/1")
        .send(body)
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(400);
      expect(result.body.message).toBe("Id must be a valid uuid");
      expect(result.body.codeError).toBe("sensor.id.not.uuid");
    });

    test("should return a 400 if sensor is not found", async () => {
      const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.ADMIN });
      jwt.verify = verifyMock;
      jwt.decode = verifyMock;

      const updateMock = jest.fn();
      updateMock.mockResolvedValue(null);
      SensorModel.update = updateMock;

      const body = { name: sensors[0].name, topic: sensors[0].topic };

      const result = await superTest(app)
        .put(baseUri + "/" + sensors[0].id)
        .send(body)
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(400);
      expect(result.body.message).toBe("Sensor not found");
      expect(result.body.codeError).toBe("sensor.not.found");
    });

    test("should return a 500 if update throw an error", async () => {
      const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.ADMIN });
      jwt.verify = verifyMock;
      jwt.decode = verifyMock;

      const updateMock = jest.fn();
      updateMock.mockRejectedValue(new Error("Error"));
      SensorModel.update = updateMock;

      const body = { name: sensors[0].name, topic: sensors[0].topic };

      const result = await superTest(app)
        .put(baseUri + "/" + sensors[0].id)
        .send(body)
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(500);
      expect(result.body.message).toBe("Server error");
      expect(result.body.codeError).toBe("server.error");
    });
    /*
    test("should return a 400 if decode return is null", async () => {
      const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.ADMIN });
      jwt.verify = verifyMock;
      const decodeMock = jest.fn();
      decodeMock.mockReturnValue(null);
      jwt.decode = decodeMock;

      const updateMock = jest.fn();
      updateMock.mockResolvedValue(sensors[0]);
      SensorModel.update = updateMock;

      const body = { name: sensors[0].name };

      const result = await superTest(app)
        .put(baseUri + "/" + sensors[0].id)
        .send(body)
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(400);
      expect(result.body.message).toBe("Invalid token !");
      expect(result.body.codeError).toBe("auth.token.invalid");
    });

    test("should return a 500 if decode throw an error", async () => {
      const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.ADMIN });
      jwt.verify = verifyMock;
      const decodeMock = jest.fn();
      decodeMock.mockRejectedValue(new Error());
      jwt.decode = decodeMock;

      const updateMock = jest.fn();
      updateMock.mockResolvedValue(sensors[0]);
      SensorModel.update = updateMock;

      const body = { name: sensors[0].name };

      const result = await superTest(app)
        .put(baseUri + "/" + sensors[0].id)
        .send(body)
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(500);
      expect(result.body.message).toBe("Server error");
      expect(result.body.codeError).toBe("server.error");
    });

    test("should return a 404 if no sensors are found", async () => {
      const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.REGULAR });
      jwt.verify = verifyMock;
      jwt.decode = verifyMock;

      const updateMock = jest.fn();
      updateMock.mockResolvedValue(sensors[0]);
      SensorModel.update = updateMock;

      const body = { name: sensors[0].name };

      const result = await superTest(app)
        .put(baseUri + "/" + sensors[0].id)
        .send(body)
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(404);
      expect(result.body.message).toBe("No sensors found !");
      expect(result.body.codeError).toBe("measurement.sensor.not.found");
    });

    test("should return a 403 if user don't have access to any sensors", async () => {
      const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.REGULAR });
      jwt.verify = verifyMock;
      jwt.decode = verifyMock;

      const findAllMock = jest.fn();
      findAllMock.mockResolvedValue([]);
      SensorModel.findAll = findAllMock;
      UserSensorAccess.findAll = findAllMock;

      const updateMock = jest.fn();
      updateMock.mockResolvedValue(sensors[0]);
      SensorModel.update = updateMock;

      const body = { name: sensors[0].name };

      const result = await superTest(app)
        .put(baseUri + "/" + sensors[0].id)
        .send(body)
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(403);
      expect(result.body.message).toBe("You don't have access to any sensor");
      expect(result.body.codeError).toBe("sensor.not.found");
    });*/
  });

  describe("DELETE /", () => {
    test("should return a 200 with the deleted sensor", async () => {
      const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.ADMIN });
      jwt.verify = verifyMock;
      jwt.decode = verifyMock;

      const destroyMock = jest.fn();
      destroyMock.mockResolvedValue(sensors[0]);
      SensorModel.destroy = destroyMock;

      const result = await superTest(app)
        .delete(baseUri + "/" + sensors[0].id)
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(200);
      expect(result.body).toEqual({ message: "Sensor deleted" });
    });

    test("should return a 400 if id is not valid", async () => {
      const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.ADMIN });
      jwt.verify = verifyMock;
      jwt.decode = verifyMock;

      const result = await superTest(app)
        .delete(baseUri + "/1")
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(400);
      expect(result.body.message).toBe("Id must be a valid uuid");
      expect(result.body.codeError).toBe("sensor.id.not.uuid");
    });

    test("should return a 400 if sensor is not found", async () => {
      const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.ADMIN });
      jwt.verify = verifyMock;
      jwt.decode = verifyMock;

      const destroyMock = jest.fn();
      destroyMock.mockResolvedValue(null);
      SensorModel.destroy = destroyMock;

      const result = await superTest(app)
        .delete(baseUri + "/" + sensors[0].id)
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(400);
      expect(result.body.message).toBe("Sensor not found");
      expect(result.body.codeError).toBe("sensor.not.found");
    });

    test("should return a 500 if destroy throw an error", async () => {
      const verifyMock = jest.fn();
      verifyMock.mockReturnValue({ id: "id-34", role: Role.ADMIN });
      jwt.verify = verifyMock;
      jwt.decode = verifyMock;

      const destroyMock = jest.fn();
      destroyMock.mockRejectedValue(new Error("Error"));
      SensorModel.destroy = destroyMock;

      const result = await superTest(app)
        .delete(baseUri + "/" + sensors[0].id)
        .set("Authorization", `Bearer 1234`);

      expect(result.status).toBe(500);
      expect(result.body.message).toBe("Server error");
      expect(result.body.codeError).toBe("server.error");
    });
  });
});
