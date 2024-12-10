// Model(s) import
import db from "@db/index";
const DB: any = db;
const { User, UserMeasurementTypeRequest, MeasurementType } = DB;
// --- End of model(s) import
import {
  askForMeasurementTypeCreation,
  createMeasurementTypeForUser,
  getUserMeasurementTypeRequests,
  verifyMeasurementTypeAvailable,
  verifyUser
} from "@controllers/userMeasurementType";
import { BadRequestException, NotFoundException, ServerErrorException } from "@utils/exceptions";
import { Request, Response } from "express";

jest.mock("@db/index", () => ({
  // Due to the establishment of associations with RAMI1, the models are now imported from the db
  // Since the models all appear in the database from @db/index, we ONLY MAKE one mock from the db!
  User: {
    findOne: jest.fn()
  },
  UserMeasurementTypeRequest: {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  },
  MeasurementType: {
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn()
  }
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

  describe("verifyMeasurementTypeAvailable", () => {
    test("should return true if measurement type is available in MeasurementType", async () => {
      const mockFindOne = jest.fn();
      mockFindOne.mockResolvedValue({});
      UserMeasurementTypeRequest.findOne = mockFindOne;

      const result = await verifyMeasurementTypeAvailable("testType");
      expect(result).toBe(true);
    });

    test("should return false if measurement type is not available", async () => {
      const mockFindOne = jest.fn();
      mockFindOne.mockResolvedValue(null);
      UserMeasurementTypeRequest.findOne = mockFindOne;
      MeasurementType.findOne = mockFindOne;

      const result = await verifyMeasurementTypeAvailable("testType");
      expect(result).toBe(false);
    });
  });

  describe("askForMeasurementTypeCreation", () => {
    test("should return 400 if user or type is missing", async () => {
      const req = {
        body: {
          user: "someUser"
        }
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      await askForMeasurementTypeCreation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new BadRequestException(
          "Missing user or measurement type name",
          "userSensor.user.id.required"
        )
      );
    });

    test("should return 400 if measurement type already exists", async () => {
      const req = {
        body: {
          user: "someUser",
          type: "someType"
        }
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({});
      User.findOne = mockFindOneUser;

      const mockFindOne = jest.fn();
      mockFindOne.mockResolvedValue({ measurementType: "someType" });
      UserMeasurementTypeRequest.findOne = mockFindOne;

      await askForMeasurementTypeCreation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new BadRequestException(
          "Measurement type already exists",
          "userSensor.sensor.already.exists"
        )
      );
    });

    test("should return 400 if user already has a request for this measurement type", async () => {
      const req = {
        body: {
          user: "someUser",
          type: "someType"
        }
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFindOneUser;

      const mockFindOne = jest.fn();
      mockFindOne.mockResolvedValueOnce(null);
      mockFindOne.mockResolvedValueOnce({});
      UserMeasurementTypeRequest.findOne = mockFindOne;

      await askForMeasurementTypeCreation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new BadRequestException(
          "User already has asked for creation",
          "userSensor.user.already.has.asked"
        )
      );
    });

    test("should return 500 if creation return nothing", async () => {
      const req = {
        body: {
          user: "someUser",
          type: "someType"
        }
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFindOneUser;

      const mockFindOne = jest.fn();
      mockFindOne.mockResolvedValue(null);
      UserMeasurementTypeRequest.findOne = mockFindOne;

      await askForMeasurementTypeCreation(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ServerErrorException(
          "Server error",
          "server.error"
        )
      );
    });

    test("should return 404 if user not found", async () => {
      const req = {
        body: {
          user: "someUser",
          type: "someType"
        }
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue(null);
      User.findOne = mockFindOneUser;

      const mockFindOne = jest.fn();
      mockFindOne.mockResolvedValue(null);
      UserMeasurementTypeRequest.findOne = mockFindOne;

      const mockCreate = jest.fn();
      mockCreate.mockResolvedValue({});
      UserMeasurementTypeRequest.create = mockCreate;

      await askForMeasurementTypeCreation(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        new NotFoundException(
          "User not found",
          "user.not.found"
        )
      );
    });

    test("should return 201 if creation return something", async () => {
      const req = {
        body: {
          user: "someUser",
          type: "someType"
        }
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFindOneUser;

      const mockFindOne = jest.fn();
      mockFindOne.mockResolvedValue(null);
      UserMeasurementTypeRequest.findOne = mockFindOne;

      const mockCreate = jest.fn();
      mockCreate.mockResolvedValue({});
      UserMeasurementTypeRequest.create = mockCreate;

      await askForMeasurementTypeCreation(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({});
    });

    test("should return 500 if user has no id", async () => {
      const req = {
        body: {
          user: "someUser",
          type: "someType"
        }
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({});
      User.findOne = mockFindOneUser;

      const mockFindOne = jest.fn();
      mockFindOne.mockResolvedValue(null);
      UserMeasurementTypeRequest.findOne = mockFindOne;

      await askForMeasurementTypeCreation(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ServerErrorException(
          "Server error",
          "server.error"
        )
      );
    });
  });

  describe("getUserMeasurementTypeRequests", () => {
    test("should return 500 if UserMeasurementTypeRequest return nothing", async () => {
      // @ts-ignore
      const req = {
        query: {
          user: "someUser",
          type: "someType",
          status: "someStatus",
          number: 1
        }
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      const mockFindAll = jest.fn();
      mockFindAll.mockResolvedValue(null);
      UserMeasurementTypeRequest.findAll = mockFindAll;

      await getUserMeasurementTypeRequests(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ServerErrorException("Server error", "server.error")
      );
    });

    test("should return 200 if UserMeasurementTypeRequest return something", async () => {
      // @ts-ignore
      const req = {
        query: {
          user: "someUser",
          type: "someType",
          status: "someStatus",
          number: 1
        }
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      const mockFindAll = jest.fn();
      mockFindAll.mockResolvedValue({});
      UserMeasurementTypeRequest.findAll = mockFindAll;

      await getUserMeasurementTypeRequests(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({});
    });

    test("should return 500 if findAll throw an error", async () => {
      // @ts-ignore
      const req = {
        query: {
          user: "someUser",
          type: "someType",
          status: "someStatus",
          number: 1
        }
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      const mockFindAll = jest.fn();
      mockFindAll.mockRejectedValue(new Error("someError"));
      UserMeasurementTypeRequest.findAll = mockFindAll;

      await getUserMeasurementTypeRequests(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ServerErrorException("Server error", "server.error")
      );
    });

    test("should return 200 if UserMeasurementTypeRequest return something (case of user not a string)", async () => {
      // @ts-ignore
      const req = {
        query: {
          user: 100,
          type: "someType",
          status: "someStatus",
          number: "1"
        }
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      const mockFindAll = jest.fn();
      mockFindAll.mockResolvedValue({});
      UserMeasurementTypeRequest.findAll = mockFindAll;

      await getUserMeasurementTypeRequests(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({});
    });

    test("should return 400 if number is invalid", async () => {
      // @ts-ignore
      const req = {
        query: {
          user: "someUser",
          type: "someType",
          status: "someStatus",
          number: "invalidNumber"
        }
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      const mockFindAll = jest.fn();
      mockFindAll.mockResolvedValue({});
      UserMeasurementTypeRequest.findAll = mockFindAll;

      await getUserMeasurementTypeRequests(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new BadRequestException(
          "Number is not valid",
          "measurement.number.not.valid"
        )
      );
    });
  });

  describe("createMeasurementTypeForUser", () => {
    test("should return 400 if user or measurement type name is missing", async () => {
      const req = {
        body: {
          userName: "someUser"
        }
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      await createMeasurementTypeForUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new BadRequestException(
          "Missing user or measurement type name",
          "userSensor.user.id.required"
        )
      );
    });
    test("should return 500 if user not found", async () => {
      const req = {
        body: {
          userName: "someUser",
          type: "someType"
        }
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      await createMeasurementTypeForUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ServerErrorException(
          "Server error",
          "server.error"
        )
      );
    });
    test("should return 400 if user already added to the sensor", async () => {
      const req = {
        body: {
          userName: "someUser",
          type: "someType"
        }
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFindOneUser;

      const mockFindOneUserMeasurementType = jest.fn();
      mockFindOneUserMeasurementType.mockResolvedValue({});
      UserMeasurementTypeRequest.findOne = mockFindOneUserMeasurementType;

      await createMeasurementTypeForUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new BadRequestException("User already added to sensor", "userSensor.user.added")
      );
    });
    test("should return 400 if user banned from the sensor", async () => {
      const req = {
        body: {
          userName: "someUser",
          type: "someType",
          banned: "true"
        }
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFindOneUser;

      const mockFindOneUserMeasurementType = jest.fn();
      mockFindOneUserMeasurementType.mockResolvedValue({});
      UserMeasurementTypeRequest.findOne = mockFindOneUserMeasurementType;

      await createMeasurementTypeForUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new BadRequestException("User banned from sensor", "userSensor.user.banned")
      );
    });
    test("should return 400 if user do not have a pending request", async () => {
      const req = {
        body: {
          userName: "someUser",
          type: "someType",
          banned: "true"
        }
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFindOneUser;

      const mockFindOneUserMeasurementType = jest.fn();
      mockFindOneUserMeasurementType.mockResolvedValue(null);
      UserMeasurementTypeRequest.findOne = mockFindOneUserMeasurementType;

      await createMeasurementTypeForUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        new BadRequestException("User does not have a pending request", "userSensor.user.pending.required")
      );
    });
    test("should return 500 if there is an error during the update", async () => {
      const req = {
        body: {
          userName: "someUser",
          type: "someType",
          banned: "true"
        }
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFindOneUser;

      const mockFindOneUserMeasurementType = jest.fn();
      mockFindOneUserMeasurementType.mockReturnValueOnce(null).mockReturnValueOnce({});
      UserMeasurementTypeRequest.findOne = mockFindOneUserMeasurementType;


      await createMeasurementTypeForUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ServerErrorException("Server error", "server.error")
      );
    });

    test("should return 500 if measurement type not found", async () => {
      const req = {
        body: {
          userName: "someUser",
          type: "someType",
          banned: "true"
        }
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFindOneUser;

      const mockFindOneUserMeasurementType = jest.fn();
      mockFindOneUserMeasurementType.mockReturnValueOnce(null).mockReturnValueOnce({});
      UserMeasurementTypeRequest.findOne = mockFindOneUserMeasurementType;

      const updateMock = jest.fn();
      updateMock.mockResolvedValue({});
      UserMeasurementTypeRequest.update = updateMock;

      const mockFindOneMeasurementType = jest.fn();
      mockFindOneMeasurementType.mockResolvedValue(null);
      MeasurementType.findOne = mockFindOneMeasurementType;

      await createMeasurementTypeForUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ServerErrorException("Server error", "server.error")
      );
    });

    test("should return 400 if there is an error during destroy", async () => {
      const req = {
        body: {
          userName: "someUser",
          type: "someType",
          banned: "true"
        }
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFindOneUser;

      const mockFindOneUserMeasurementType = jest.fn();
      mockFindOneUserMeasurementType.mockReturnValueOnce(null).mockReturnValueOnce({});
      UserMeasurementTypeRequest.findOne = mockFindOneUserMeasurementType;

      const updateMock = jest.fn();
      updateMock.mockResolvedValue({});
      UserMeasurementTypeRequest.update = updateMock;

      const mockFindOneMeasurementType = jest.fn();
      mockFindOneMeasurementType.mockResolvedValue({});
      MeasurementType.findOne = mockFindOneMeasurementType;

      const mockDestroy = jest.fn();
      mockDestroy.mockResolvedValue(null);
      MeasurementType.destroy = mockDestroy;

      await createMeasurementTypeForUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ServerErrorException("Server error", "server.error")
      );
    });

    test("should return 500 if there is an error during the creation", async () => {
      const req = {
        body: {
          userName: "someUser",
          type: "someType",
          banned: "false"
        }
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFindOneUser;

      const mockFindOneUserMeasurementType = jest.fn();
      mockFindOneUserMeasurementType.mockReturnValueOnce(null).mockReturnValueOnce({});
      UserMeasurementTypeRequest.findOne = mockFindOneUserMeasurementType;

      const updateMock = jest.fn();
      updateMock.mockResolvedValue({});
      UserMeasurementTypeRequest.update = updateMock;

      const createMock = jest.fn();
      createMock.mockResolvedValue(null);
      MeasurementType.create = createMock;

      await createMeasurementTypeForUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        new ServerErrorException("Server error", "server.error")
      );
    });

    test("should return 200 if the creation is ok", async () => {
      const req = {
        body: {
          userName: "someUser",
          type: "someType",
          banned: "false"
        }
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFindOneUser;

      const mockFindOneUserMeasurementType = jest.fn();
      mockFindOneUserMeasurementType.mockReturnValueOnce(null).mockReturnValueOnce({});
      UserMeasurementTypeRequest.findOne = mockFindOneUserMeasurementType;

      const updateMock = jest.fn();
      updateMock.mockResolvedValue({});
      UserMeasurementTypeRequest.update = updateMock;

      const createMock = jest.fn();
      createMock.mockResolvedValue({});
      MeasurementType.create = createMock;

      await createMeasurementTypeForUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Sensor created" });
    });

    test("should return 200 if measurement type is well delete", async () => {
      const req = {
        body: {
          userName: "someUser",
          type: "someType",
          banned: "true"
        }
      } as Request;

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      } as unknown as Response;

      const mockFindOneUser = jest.fn();
      mockFindOneUser.mockResolvedValue({ dataValues: { id: "someId" } });
      User.findOne = mockFindOneUser;

      const mockFindOneUserMeasurementType = jest.fn();
      mockFindOneUserMeasurementType.mockReturnValueOnce(null).mockReturnValueOnce({});
      UserMeasurementTypeRequest.findOne = mockFindOneUserMeasurementType;

      const updateMock = jest.fn();
      updateMock.mockResolvedValue({});
      UserMeasurementTypeRequest.update = updateMock;

      const mockFindOneMeasurementType = jest.fn();
      mockFindOneMeasurementType.mockResolvedValue({});
      MeasurementType.findOne = mockFindOneMeasurementType;

      const mockDestroy = jest.fn();
      mockDestroy.mockResolvedValue({});
      MeasurementType.destroy = mockDestroy;

      await createMeasurementTypeForUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Sensor deleted" });
    });
  });
});