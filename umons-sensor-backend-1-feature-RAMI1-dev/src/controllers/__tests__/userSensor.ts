// Model(s) import
import db from "@db/index";
const DB: any = db;
const { Sensor, User, UserSensorAccess, UserSensorRequest } = DB;
// --- End of model(s) import
import {
  addUsersToSensor,
  askForSensorAccess,
  askForSensorCreation,
  createSensorForUser,
  getUserSensorRequests,
  getUserSensorsAccess,
  removeUserFromSensor,
  verifySensor,
  verifyUser,
} from "@controllers/userSensor";
import {
  BadRequestException,
  NotFoundException,
  ServerErrorException,
} from "@utils/exceptions";
import { Request, Response } from "express";

jest.mock("@db/index", () => ({
  // Due to the establishment of associations with RAMI1, the models are now imported from the db
  // Since the models all appear in the database from @db/index, we ONLY MAKE one mock from the db!
  Sensor: {
    findOne: jest.fn(),
    destroy: jest.fn(),
  },
  User: {
    findOne: jest.fn(),
  },
  UserSensorAccess: {
    findOne: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    create: jest.fn(),
  },
  UserSensorRequest: {
    findOne: jest.fn(),
  },
}));

describe("Auxiliary functions", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe("verifyUser", () => {
    test("should throw NotFoundException if user not found", async () => {
      const mockFindOne = jest.fn();
      mockFindOne.mockResolvedValue(null);
      User.findOne = mockFindOne;

      try {
        await verifyUser("");
        fail("NotFoundException was not thrown");
      } catch (error: any) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe("User not found");
        expect(error.codeError).toBe("user.not.found");
      }
    });

    test("should return user if user found", async () => {
      const mockFindOne = jest.fn();
      mockFindOne.mockResolvedValue({});
      User.findOne = mockFindOne;

      const user = await verifyUser("");
      expect(user).toEqual({});
    });
  });

  describe("verifySensor", () => {
    test("should throw NotFoundException if sensor not found", async () => {
      const mockFindOne = jest.fn();
      mockFindOne.mockResolvedValue(null);
      Sensor.findOne = mockFindOne;

      try {
        await verifySensor("");
        fail("NotFoundException was not thrown");
      } catch (error: any) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe("Sensor not found");
        expect(error.codeError).toBe("sensor.not.found");
      }
    });
    test("should return sensor if sensor found", async () => {
      const mockFindOne = jest.fn();
      mockFindOne.mockResolvedValue({});
      Sensor.findOne = mockFindOne;

      const sensor = await verifySensor("");
      expect(sensor).toEqual({});
    });
  });

  describe("addUsersToSensor", () => {
    test("should return 400 if user or sensor name is missing", async () => {
      const req = {
        body: {
          userName: "someUser",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      await addUsersToSensor(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new BadRequestException(
          "Missing user or sensor name",
          "userSensor.user.id.required"
        )
      );
    });
    test("should return 400 if user banned from sensor", async () => {
      const req = {
        body: {
          userName: "someUser",
          sensorName: "someSensor",
          banned: "true",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindOneSensor = jest.fn();
      mockFindOneSensor.mockResolvedValue({ dataValues: { id: "someId" } });
      Sensor.findOne = mockFindOneSensor;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFindOneUser;

      const mockFindOneUserSensorAccess = jest.fn();
      mockFindOneUserSensorAccess.mockResolvedValue({});
      UserSensorAccess.findOne = mockFindOneUserSensorAccess;

      await addUsersToSensor(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new BadRequestException(
          "User banned from sensor",
          "userSensor.user.banned"
        )
      );
    });
    test("should return 400 if user already has access to sensor", async () => {
      const req = {
        body: {
          userName: "someUser",
          sensorName: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindOneSensor = jest.fn();
      mockFindOneSensor.mockResolvedValue({ dataValues: { id: "someId" } });
      Sensor.findOne = mockFindOneSensor;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFindOneUser;

      const mockFindOneUserSensorAccess = jest.fn();
      mockFindOneUserSensorAccess.mockResolvedValue({});
      UserSensorAccess.findOne = mockFindOneUserSensorAccess;

      await addUsersToSensor(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new BadRequestException(
          "User already added to sensor",
          "userSensor.user.added"
        )
      );
    });
    test("should return 400 if user does not have pending request to sensor", async () => {
      const req = {
        body: {
          userName: "someUser",
          sensorName: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindOneSensor = jest.fn();
      mockFindOneSensor.mockResolvedValue({ dataValues: { id: "someId" } });
      Sensor.findOne = mockFindOneSensor;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFindOneUser;

      const mockFindOneUserSensorAccess = jest.fn();
      mockFindOneUserSensorAccess.mockResolvedValue(null);
      UserSensorAccess.findOne = mockFindOneUserSensorAccess;

      await addUsersToSensor(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new BadRequestException(
          "User does not have a pending request",
          "userSensor.user.pending.required"
        )
      );
    });
    test("should return 500 if update throw nothing", async () => {
      const req = {
        body: {
          userName: "someUser",
          sensorName: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindOneSensor = jest.fn();
      mockFindOneSensor.mockResolvedValue({ dataValues: { id: "someId" } });
      Sensor.findOne = mockFindOneSensor;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFindOneUser;

      const mockFindOneUserSensorAccess = jest.fn();
      mockFindOneUserSensorAccess.mockResolvedValueOnce(null);
      mockFindOneUserSensorAccess.mockResolvedValueOnce({});
      UserSensorAccess.findOne = mockFindOneUserSensorAccess;

      const mockUpdate = jest.fn();
      mockUpdate.mockResolvedValue(null);
      UserSensorAccess.update = mockUpdate;

      await addUsersToSensor(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ServerErrorException("Server error", "server.error")
      );
    });
    test("should return 201 if sensor updated", async () => {
      const req = {
        body: {
          userName: "someUser",
          sensorName: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindOneSensor = jest.fn();
      mockFindOneSensor.mockResolvedValue({ dataValues: { id: "someId" } });
      Sensor.findOne = mockFindOneSensor;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFindOneUser;

      const mockFindOneUserSensorAccess = jest.fn();
      mockFindOneUserSensorAccess.mockResolvedValueOnce(null);
      mockFindOneUserSensorAccess.mockResolvedValueOnce({});
      UserSensorAccess.findOne = mockFindOneUserSensorAccess;

      const mockUpdate = jest.fn();
      mockUpdate.mockResolvedValue({});
      UserSensorAccess.update = mockUpdate;

      await addUsersToSensor(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User added to sensor",
      });
    });
    test("should return 500 if id is missing", async () => {
      const req = {
        body: {
          userName: "someUser",
          sensorName: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindOneSensor = jest.fn();
      mockFindOneSensor.mockResolvedValue({});
      Sensor.findOne = mockFindOneSensor;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFindOneUser;

      const mockFindOneUserSensorAccess = jest.fn();
      mockFindOneUserSensorAccess.mockResolvedValueOnce(null);
      mockFindOneUserSensorAccess.mockResolvedValueOnce({});
      UserSensorAccess.findOne = mockFindOneUserSensorAccess;

      const mockUpdate = jest.fn();
      mockUpdate.mockResolvedValue({});
      UserSensorAccess.update = mockUpdate;

      await addUsersToSensor(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ServerErrorException("Server error", "server.error")
      );
    });
    test("should return 404 if user not found", async () => {
      const req = {
        body: {
          userName: "someUser",
          sensorName: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindOneSensor = jest.fn();
      mockFindOneSensor.mockResolvedValue({});
      Sensor.findOne = mockFindOneSensor;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue(null);
      User.findOne = mockFindOneUser;

      await addUsersToSensor(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        new NotFoundException("User not found", "user.not.found")
      );
    });
  });

  describe("removeUserFromSensor", () => {
    test("should return 400 if user or sensor name is missing", async () => {
      const req = {
        body: {
          userName: "someUser",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      await removeUserFromSensor(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new BadRequestException(
          "Missing user or sensor name",
          "userSensor.user.id.required"
        )
      );
    });
    test("should return 500 if destroy throw nothing", async () => {
      const req = {
        body: {
          userName: "someUser",
          sensorName: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindOneSensor = jest.fn();
      mockFindOneSensor.mockResolvedValue({ dataValues: { id: "someId" } });
      Sensor.findOne = mockFindOneSensor;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFindOneUser;

      const mockDestroy = jest.fn();
      mockDestroy.mockResolvedValue(null);
      UserSensorAccess.destroy = mockDestroy;

      await removeUserFromSensor(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ServerErrorException("Server error", "server.error")
      );
    });
    test("should return 200 if user removed from sensor", async () => {
      const req = {
        body: {
          userName: "someUser",
          sensorName: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindOneSensor = jest.fn();
      mockFindOneSensor.mockResolvedValue({ dataValues: { id: "someId" } });
      Sensor.findOne = mockFindOneSensor;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFindOneUser;

      const mockDestroy = jest.fn();
      mockDestroy.mockResolvedValue({});
      UserSensorAccess.destroy = mockDestroy;

      await removeUserFromSensor(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User removed from sensor",
      });
    });
    test("should return 404 if user not found", async () => {
      const req = {
        body: {
          userName: "someUser",
          sensorName: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindOneSensor = jest.fn();
      mockFindOneSensor.mockResolvedValue({ dataValues: { id: "someId" } });
      Sensor.findOne = mockFindOneSensor;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue(null);
      User.findOne = mockFindOneUser;

      const mockDestroy = jest.fn();
      mockDestroy.mockResolvedValue({});
      UserSensorAccess.destroy = mockDestroy;

      await removeUserFromSensor(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        new NotFoundException("User not found", "user.not.found")
      );
    });
    test("should return 500 if id is missing", async () => {
      const req = {
        body: {
          userName: "someUser",
          sensorName: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindOneSensor = jest.fn();
      mockFindOneSensor.mockResolvedValue({ dataValues: { id: "someId" } });
      Sensor.findOne = mockFindOneSensor;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({});
      User.findOne = mockFindOneUser;

      const mockDestroy = jest.fn();
      mockDestroy.mockResolvedValue({});
      UserSensorAccess.destroy = mockDestroy;

      await removeUserFromSensor(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ServerErrorException("Server error", "server.error")
      );
    });
  });

  describe("getUserSensorsAccess", () => {
    test("should return 400 if number is not a number", async () => {
      const req = {
        body: {
          status: "someStatus",
          number: "someNumber",
          user: "someUser",
          sensor: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      await getUserSensorsAccess(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new BadRequestException(
          "Number is not valid",
          "measurement.number.not.valid"
        )
      );
    });
    test("should return 500 if findAll return nothing", async () => {
      const req = {
        body: {
          status: "someStatus",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindAll = jest.fn();
      mockFindAll.mockResolvedValue(null);
      UserSensorAccess.findAll = mockFindAll;

      await getUserSensorsAccess(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ServerErrorException("Server error", "server.error")
      );
    });
    test("should return 200 if findAll return something", async () => {
      const req = {
        body: {
          status: "someStatus",
          number: "1",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindAll = jest.fn();
      mockFindAll.mockResolvedValue({});
      UserSensorAccess.findAll = mockFindAll;

      await getUserSensorsAccess(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({});
    });
    test("should return 500 if findAll return an error", async () => {
      const req = {
        body: {
          status: "someStatus",
          number: "1",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindAll = jest.fn();
      mockFindAll.mockRejectedValue({});
      UserSensorAccess.findAll = mockFindAll;

      await getUserSensorsAccess(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ServerErrorException("Server error", "server.error")
      );
    });
  });

  describe("askForSensorAccess", () => {
    test("should return 400 if there is no user or no sensor", async () => {
      const req = {
        body: {
          user: "someUser",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      await askForSensorAccess(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new BadRequestException(
          "Missing user or sensor name",
          "userSensor.user.id.required"
        )
      );
    });
    test("should return 500 if there is no id", async () => {
      const req = {
        body: {
          user: "someUser",
          sensor: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({});
      User.findOne = mockFindOneUser;

      const mockFindOneSensor = jest.fn();
      mockFindOneSensor.mockResolvedValue({});
      Sensor.findOne = mockFindOneSensor;

      await askForSensorAccess(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ServerErrorException("Server error", "server.error")
      );
    });
    test("should return 400 if user already has ask for access", async () => {
      const req = {
        body: {
          user: "someUser",
          sensor: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFindOneUser;

      const mockFindOneSensor = jest.fn();
      mockFindOneSensor.mockResolvedValue({ dataValues: { id: "someId" } });
      Sensor.findOne = mockFindOneSensor;

      const mockFindOneUserSensorAccess = jest.fn();
      mockFindOneUserSensorAccess.mockResolvedValue({});
      UserSensorAccess.findOne = mockFindOneUserSensorAccess;

      await askForSensorAccess(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new BadRequestException(
          "User already has asked for access",
          "userSensor.user.already.has.asked"
        )
      );
    });
    test("should return 500 if create return nothing", async () => {
      const req = {
        body: {
          user: "someUser",
          sensor: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFindOneUser;

      const mockFindOneSensor = jest.fn();
      mockFindOneSensor.mockResolvedValue({ dataValues: { id: "someId" } });
      Sensor.findOne = mockFindOneSensor;

      const mockFindOneUserSensorAccess = jest.fn();
      mockFindOneUserSensorAccess.mockResolvedValue(null);
      UserSensorAccess.findOne = mockFindOneUserSensorAccess;

      const mockCreate = jest.fn();
      mockCreate.mockResolvedValue(null);
      UserSensorAccess.create = mockCreate;

      await askForSensorAccess(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ServerErrorException("Server error", "server.error")
      );
    });
    test("should return 201 if create return something", async () => {
      const req = {
        body: {
          user: "someUser",
          sensor: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFindOneUser;

      const mockFindOneSensor = jest.fn();
      mockFindOneSensor.mockResolvedValue({ dataValues: { id: "someId" } });
      Sensor.findOne = mockFindOneSensor;

      const mockFindOneUserSensorAccess = jest.fn();
      mockFindOneUserSensorAccess.mockResolvedValue(null);
      UserSensorAccess.findOne = mockFindOneUserSensorAccess;

      const mockCreate = jest.fn();
      mockCreate.mockResolvedValue({});
      UserSensorAccess.create = mockCreate;

      await askForSensorAccess(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({});
    });
    test("should return 404 if sensor not found", async () => {
      const req = {
        body: {
          user: "someUser",
          sensor: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindOneSensor = jest.fn();
      mockFindOneSensor.mockResolvedValue(null);
      Sensor.findOne = mockFindOneSensor;

      await askForSensorAccess(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        new NotFoundException("Sensor not found", "sensor.not.found")
      );
    });
  });

  describe("askForSensorCreation", () => {
    test("should return 400 if there is no user or no sensor", async () => {
      const req = {
        body: {
          user: "someUser",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      await askForSensorCreation(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new BadRequestException(
          "Missing user or sensor name",
          "userSensor.user.id.required"
        )
      );
    });
    test("should return 400 if sensor already exist", async () => {
      const req = {
        body: {
          user: "someUser",
          sensor: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({});
      User.findOne = mockFindOneUser;

      const mockFindOneSensor = jest.fn();
      mockFindOneSensor.mockResolvedValue({});
      Sensor.findOne = mockFindOneSensor;
      UserSensorRequest.findOne = mockFindOneSensor;

      await askForSensorCreation(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new BadRequestException(
          "Sensor already exists",
          "userSensor.sensor.already.exists"
        )
      );
    });
    test("should return 400 if user already has ask for creation", async () => {
      const req = {
        body: {
          user: "someUser",
          sensor: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFindOneUser;

      const mockFindOneSensor = jest.fn();
      mockFindOneSensor.mockResolvedValueOnce(null);
      mockFindOneSensor.mockResolvedValueOnce(null);
      mockFindOneSensor.mockResolvedValueOnce({});
      Sensor.findOne = mockFindOneSensor;
      UserSensorRequest.findOne = mockFindOneSensor;

      await askForSensorCreation(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new BadRequestException(
          "User already has asked for creation",
          "userSensor.user.already.has.asked"
        )
      );
    });
    test("should return 500 if create return nothing", async () => {
      const req = {
        body: {
          user: "someUser",
          sensor: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFindOneUser;

      const mockFindOneSensor = jest.fn();
      mockFindOneSensor.mockResolvedValue(null);
      Sensor.findOne = mockFindOneSensor;
      UserSensorRequest.findOne = mockFindOneSensor;

      const mockCreate = jest.fn();
      mockCreate.mockResolvedValue(null);
      UserSensorRequest.create = mockCreate;

      await askForSensorCreation(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ServerErrorException("Server error", "server.error")
      );
    });
    test("should return 201 if create return something", async () => {
      const req = {
        body: {
          user: "someUser",
          sensor: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFindOneUser;

      const mockFindOneSensor = jest.fn();
      mockFindOneSensor.mockResolvedValue(null);
      Sensor.findOne = mockFindOneSensor;
      UserSensorRequest.findOne = mockFindOneSensor;

      const mockCreate = jest.fn();
      mockCreate.mockResolvedValue({});
      UserSensorRequest.create = mockCreate;

      await askForSensorCreation(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({});
    });
    test("should return 404 if user not found", async () => {
      const req = {
        body: {
          user: "someUser",
          sensor: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue(null);
      User.findOne = mockFindOneUser;

      await askForSensorCreation(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        new NotFoundException("User not found", "user.not.found")
      );
    });
    test("should return 500 if no id is returned", async () => {
      const req = {
        body: {
          user: "someUser",
          sensor: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({});
      User.findOne = mockFindOneUser;

      const mockFindOneSensor = jest.fn();
      mockFindOneSensor.mockResolvedValue(null);
      Sensor.findOne = mockFindOneSensor;
      UserSensorRequest.findOne = mockFindOneSensor;

      const mockCreate = jest.fn();
      mockCreate.mockResolvedValue({});
      UserSensorRequest.create = mockCreate;

      await askForSensorCreation(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ServerErrorException("Server error", "server.error")
      );
    });
  });

  describe("getUserSensorRequests", () => {
    test("should return 400 if number is not a number", async () => {
      const req = {
        body: {
          user: "someUser",
          sensor: "someSensor",
          number: "notANumber",
          status: "someStatus",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      await getUserSensorRequests(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new BadRequestException(
          "Number is not valid",
          "measurement.number.not.valid"
        )
      );
    });
    test("should return 500 if findAll return nothing", async () => {
      const req = {
        body: {
          sensor: "someSensor",
          status: "someStatus",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindAll = jest.fn();
      mockFindAll.mockResolvedValue(null);
      UserSensorRequest.findAll = mockFindAll;

      await getUserSensorRequests(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ServerErrorException("Server error", "server.error")
      );
    });
    test("should return 200 if findAll return something", async () => {
      const req = {
        body: {
          sensor: "someSensor",
          status: "someStatus",
          number: "10",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindAll = jest.fn();
      mockFindAll.mockResolvedValue({});
      UserSensorRequest.findAll = mockFindAll;

      await getUserSensorRequests(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({});
    });
    test("should return 500 if findAll return an error", async () => {
      const req = {
        body: {
          sensor: "someSensor",
          status: "someStatus",
          number: "10",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFindAll = jest.fn();
      mockFindAll.mockRejectedValue({});
      UserSensorRequest.findAll = mockFindAll;

      await getUserSensorRequests(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ServerErrorException("Server error", "server.error")
      );
    });
  });

  describe("createSensorForUser", () => {
    test("should return 400 if no user or sensor name is provided", async () => {
      const req = {
        body: {
          userName: "someUser",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      await createSensorForUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new BadRequestException(
          "Missing user or sensor name",
          "userSensor.user.id.required"
        )
      );
    });
    test("should return 400 if user banned from sensor", async () => {
      const req = {
        body: {
          userName: "someUser",
          sensorName: "someSensor",
          banned: "true",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFIndOneUser = jest.fn();
      mockFIndOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFIndOneUser;

      const mockFindOneUserSensorRequest = jest.fn();
      mockFindOneUserSensorRequest.mockResolvedValue({
        dataValues: { id: "someId" },
      });
      UserSensorRequest.findOne = mockFindOneUserSensorRequest;

      await createSensorForUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new BadRequestException(
          "User banned from sensor",
          "userSensor.user.banned"
        )
      );
    });
    test("should return 400 if user already added to sensor", async () => {
      const req = {
        body: {
          userName: "someUser",
          sensorName: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFIndOneUser = jest.fn();
      mockFIndOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFIndOneUser;

      const mockFindOneUserSensorRequest = jest.fn();
      mockFindOneUserSensorRequest.mockResolvedValue({
        dataValues: { id: "someId" },
      });
      UserSensorRequest.findOne = mockFindOneUserSensorRequest;

      await createSensorForUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new BadRequestException(
          "User already added to sensor",
          "userSensor.user.added"
        )
      );
    });
    test("should return 400 if user does not have a pending request", async () => {
      const req = {
        body: {
          userName: "someUser",
          sensorName: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFIndOneUser = jest.fn();
      mockFIndOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFIndOneUser;

      const mockFindOneUserSensorRequest = jest.fn();
      mockFindOneUserSensorRequest.mockResolvedValue(null);
      UserSensorRequest.findOne = mockFindOneUserSensorRequest;

      await createSensorForUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new BadRequestException(
          "User does not have a pending request",
          "userSensor.user.pending.required"
        )
      );
    });
    test("should return 500 if update return nothing", async () => {
      const req = {
        body: {
          userName: "someUser",
          sensorName: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFIndOneUser = jest.fn();
      mockFIndOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFIndOneUser;

      const mockFindOneUserSensorRequest = jest.fn();
      mockFindOneUserSensorRequest.mockResolvedValueOnce(null);
      mockFindOneUserSensorRequest.mockResolvedValueOnce({});
      UserSensorRequest.findOne = mockFindOneUserSensorRequest;

      const mockUpdate = jest.fn();
      mockUpdate.mockResolvedValue(null);
      UserSensorRequest.update = mockUpdate;

      await createSensorForUser(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ServerErrorException("Server error", "server.error")
      );
    });
    test("should return 500 if sensor to ban if not found", async () => {
      const req = {
        body: {
          userName: "someUser",
          sensorName: "someSensor",
          banned: "true",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFIndOneUser = jest.fn();
      mockFIndOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFIndOneUser;

      const mockFindOneUserSensorRequest = jest.fn();
      mockFindOneUserSensorRequest.mockResolvedValueOnce(null);
      mockFindOneUserSensorRequest.mockResolvedValueOnce({});
      UserSensorRequest.findOne = mockFindOneUserSensorRequest;

      const mockUpdate = jest.fn();
      mockUpdate.mockResolvedValue({});
      UserSensorRequest.update = mockUpdate;

      const mockFindOneSensor = jest.fn();
      mockFindOneSensor.mockResolvedValue(null);
      Sensor.findOne = mockFindOneSensor;

      await createSensorForUser(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ServerErrorException("Server error", "server.error")
      );
    });
    test("should return 500 if destroy return nothing", async () => {
      const req = {
        body: {
          userName: "someUser",
          sensorName: "someSensor",
          banned: "true",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFIndOneUser = jest.fn();
      mockFIndOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFIndOneUser;

      const mockFindOneUserSensorRequest = jest.fn();
      mockFindOneUserSensorRequest.mockResolvedValueOnce(null);
      mockFindOneUserSensorRequest.mockResolvedValueOnce({});
      UserSensorRequest.findOne = mockFindOneUserSensorRequest;

      const mockUpdate = jest.fn();
      mockUpdate.mockResolvedValue({});
      UserSensorRequest.update = mockUpdate;

      const mockFindOneSensor = jest.fn();
      mockFindOneSensor.mockResolvedValue({});
      Sensor.findOne = mockFindOneSensor;

      const mockDestroy = jest.fn();
      mockDestroy.mockResolvedValue(null);
      Sensor.destroy = mockDestroy;

      await createSensorForUser(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ServerErrorException("Server error", "server.error")
      );
    });
    test("should return 500 if create return nothing", async () => {
      const req = {
        body: {
          userName: "someUser",
          sensorName: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFIndOneUser = jest.fn();
      mockFIndOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFIndOneUser;

      const mockFindOneUserSensorRequest = jest.fn();
      mockFindOneUserSensorRequest.mockResolvedValueOnce(null);
      mockFindOneUserSensorRequest.mockResolvedValueOnce({});
      UserSensorRequest.findOne = mockFindOneUserSensorRequest;

      const mockUpdate = jest.fn();
      mockUpdate.mockResolvedValue({});
      UserSensorRequest.update = mockUpdate;

      const mockCreate = jest.fn();
      mockCreate.mockResolvedValue(null);
      Sensor.create = mockCreate;

      await createSensorForUser(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ServerErrorException("Server error", "server.error")
      );
    });
    test("should return 200 if sensor destroyed", async () => {
      const req = {
        body: {
          userName: "someUser",
          sensorName: "someSensor",
          banned: "true",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFIndOneUser = jest.fn();
      mockFIndOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFIndOneUser;

      const mockFindOneUserSensorRequest = jest.fn();
      mockFindOneUserSensorRequest.mockResolvedValueOnce(null);
      mockFindOneUserSensorRequest.mockResolvedValueOnce({});
      UserSensorRequest.findOne = mockFindOneUserSensorRequest;

      const mockUpdate = jest.fn();
      mockUpdate.mockResolvedValue({});
      UserSensorRequest.update = mockUpdate;

      const mockFindOneSensor = jest.fn();
      mockFindOneSensor.mockResolvedValue({});
      Sensor.findOne = mockFindOneSensor;

      const mockDestroy = jest.fn();
      mockDestroy.mockResolvedValue({});
      Sensor.destroy = mockDestroy;

      await createSensorForUser(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Sensor deleted" });
    });
    test("should return 200 if sensor created", async () => {
      const req = {
        body: {
          userName: "someUser",
          sensorName: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFIndOneUser = jest.fn();
      mockFIndOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFIndOneUser;

      const mockFindOneUserSensorRequest = jest.fn();
      mockFindOneUserSensorRequest.mockResolvedValueOnce(null);
      mockFindOneUserSensorRequest.mockResolvedValueOnce({});
      UserSensorRequest.findOne = mockFindOneUserSensorRequest;

      const mockUpdate = jest.fn();
      mockUpdate.mockResolvedValue({});
      UserSensorRequest.update = mockUpdate;

      const mockCreate = jest.fn();
      mockCreate.mockResolvedValue({});
      Sensor.create = mockCreate;

      await createSensorForUser(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Sensor created" });
    });
    test("should return 500 if create return an error", async () => {
      const req = {
        body: {
          userName: "someUser",
          sensorName: "someSensor",
        },
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      } as unknown as Response;

      const mockFIndOneUser = jest.fn();
      mockFIndOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFIndOneUser;

      const mockFindOneUserSensorRequest = jest.fn();
      mockFindOneUserSensorRequest.mockResolvedValueOnce(null);
      mockFindOneUserSensorRequest.mockResolvedValueOnce({});
      UserSensorRequest.findOne = mockFindOneUserSensorRequest;

      const mockUpdate = jest.fn();
      mockUpdate.mockResolvedValue({});
      UserSensorRequest.update = mockUpdate;

      const mockCreate = jest.fn();
      mockCreate.mockRejectedValue({});
      Sensor.create = mockCreate;

      await createSensorForUser(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ServerErrorException("Server error", "server.error")
      );
    });
  });
});
