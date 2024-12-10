import { Request, Response } from "express";
import {
  BadRequestException,
  NotFoundException,
  ServerErrorException,
} from "@utils/exceptions";
// Model(s) import
import db from "@db/index";
const DB: any = db;
const { User, UserMeasurementTypeRequest, MeasurementType } = DB;
// --- End of model(s) import
import { Status } from "#/sensor";
import { FindAttributeOptions, OrderItem } from "sequelize";

const verifyUser = async (userName: string) => {
  const user = await User.findOne({ where: { email: userName } });
  if (!user) {
    throw new NotFoundException("User not found", "user.not.found");
  }
  return user;
};

async function verifyMeasurementTypeAvailable(measurementType: string) {
  return (
    !!(await UserMeasurementTypeRequest.findOne({
      where: {
        measurementType: measurementType,
      },
    })) ||
    !!(await MeasurementType.findOne({
      where: {
        name: measurementType,
      },
    }))
  );
}

const askForMeasurementTypeCreation = async (req: Request, res: Response) => {
  const { user, type } = req.body;
  if (!user || !type) {
    return res
      .status(400)
      .json(
        new BadRequestException(
          "Missing user or measurement type name",
          "userSensor.user.id.required"
        )
      );
  }
  try {
    const userTmp = await verifyUser(user);
    if (await verifyMeasurementTypeAvailable(type)) {
      return res
        .status(400)
        .json(
          new BadRequestException(
            "Measurement type already exists",
            "userSensor.sensor.already.exists"
          )
        );
    }
    const check = await UserMeasurementTypeRequest.findOne({
      where: {
        userId: userTmp.dataValues.id,
        measurementType: type,
      },
    });
    if (check) {
      return res
        .status(400)
        .json(
          new BadRequestException(
            "User already has asked for creation",
            "userSensor.user.already.has.asked"
          )
        );
    }
    const result = await UserMeasurementTypeRequest.create({
      userId: userTmp.dataValues.id,
      measurementType: type,
    });
    if (!result) {
      return res
        .status(500)
        .json(new ServerErrorException("Server error", "server.error"));
    }
    return res.status(201).json(result);
  } catch (error) {
    switch (true) {
      case error instanceof NotFoundException:
        return res.status(404).json(error);
      default:
        return res
          .status(500)
          .json(new ServerErrorException("Server error", "server.error"));
    }
  }
};

const getUserMeasurementTypeRequests = async (req: Request, res: Response) => {
  const { user, type, status, number } = req.query;

  const includeOptions = [];
  if (user && typeof user === "string") {
    includeOptions.push({
      model: User,
      attributes: ["email"],
      where: { email: user },
    });
  } else {
    includeOptions.push({
      model: User,
      attributes: ["email"],
    });
  }

  const whereOptions = [];
  if (status && typeof status === "string") {
    whereOptions.push({
      status: status,
    });
  }

  if (type && typeof type === "string") {
    whereOptions.push({
      measurementType: type,
    });
  }

  let numberInt = -1;
  if (number && typeof number === "string") {
    numberInt = parseInt(number);
    if (isNaN(numberInt)) {
      return res
        .status(400)
        .json(
          new BadRequestException(
            "Number is not valid",
            "measurement.number.not.valid"
          )
        );
    }
  }

  const orderOptions = [
    ["status", "ASC"],
    ["createdAt", "DESC"],
    [User, "email", "ASC"],
  ] as OrderItem[];

  const attributesOptions = [
    "id",
    "measurementType",
    "status",
    "createdAt",
  ] as FindAttributeOptions;

  try {
    const result =
      numberInt > 0
        ? await UserMeasurementTypeRequest.findAll({
            include: includeOptions,
            attributes: attributesOptions,
            where: whereOptions,
            order: orderOptions,
            limit: numberInt,
          })
        : await UserMeasurementTypeRequest.findAll({
            include: includeOptions,
            attributes: attributesOptions,
            where: whereOptions,
            order: orderOptions,
          });

    if (!result) {
      return res
        .status(500)
        .json(new ServerErrorException("Server error", "server.error"));
    }
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json(new ServerErrorException("Server error", "server.error"));
  }
};

const createMeasurementTypeForUser = async (req: Request, res: Response) => {
  const { userName, type, banned } = req.body;
  if (!userName || !type) {
    return res
      .status(400)
      .json(
        new BadRequestException(
          "Missing user or measurement type name",
          "userSensor.user.id.required"
        )
      );
  }

  try {
    const user = await verifyUser(userName);
    const willBeBanned = banned?.toLowerCase() == "true";
    const status = willBeBanned ? Status.REFUSED : Status.ACCEPTED;
    const check = await UserMeasurementTypeRequest.findOne({
      where: {
        userId: user.dataValues.id,
        measurementType: type,
        status,
      },
    });
    if (check) {
      const message = willBeBanned
        ? "User banned from sensor"
        : "User already added to sensor";
      const code = willBeBanned
        ? "userSensor.user.banned"
        : "userSensor.user.added";
      return res.status(400).json(new BadRequestException(message, code));
    }

    const secondCheck = await UserMeasurementTypeRequest.findOne({
      where: {
        userId: user.dataValues.id,
        measurementType: type,
      },
    });
    if (!secondCheck) {
      return res
        .status(400)
        .json(
          new BadRequestException(
            "User does not have a pending request",
            "userSensor.user.pending.required"
          )
        );
    }

    const result = await UserMeasurementTypeRequest.update(
      { status: status },
      { where: { userId: user.dataValues.id, measurementType: type } }
    );
    if (!result) {
      return res
        .status(500)
        .json(new ServerErrorException("Server error", "server.error"));
    }

    //const { error } = await sendMail(
    //userName,
    //"UMONS",
    //"Your request has been " + (willBeBanned ? "refused" : "accepted")
    //);

    //if (error) {
    //return res
    //.status(207)
    //.json(
    //new MultiStatusException("Mail not sent", "userSensor.mail.not.sent")
    //);
    //}

    if (willBeBanned) {
      const result2 = await MeasurementType.findOne({
        where: {
          name: type,
        },
      });
      if (!result2) {
        return res
          .status(500)
          .json(new ServerErrorException("Server error", "server.error"));
      }

      const result3 = await MeasurementType.destroy({
        where: {
          name: type,
        },
      });
      if (!result3) {
        return res
          .status(500)
          .json(new ServerErrorException("Server error", "server.error"));
      }
    } else {
      const result2 = await MeasurementType.create({
        name: type,
      });
      if (!result2) {
        return res
          .status(500)
          .json(new ServerErrorException("Server error", "server.error"));
      }
    }
    const messageTmp = willBeBanned ? "Sensor deleted" : "Sensor created";
    return res.status(200).json({ message: messageTmp });
  } catch (error) {
    return res
      .status(500)
      .json(new ServerErrorException("Server error", "server.error"));
  }
};

export {
  verifyUser,
  verifyMeasurementTypeAvailable,
  askForMeasurementTypeCreation,
  getUserMeasurementTypeRequests,
  createMeasurementTypeForUser,
};
