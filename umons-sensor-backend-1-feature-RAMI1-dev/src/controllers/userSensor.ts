import { Request, Response } from "express";
import {
  BadRequestException,
  //MultiStatusException,
  NotFoundException,
  ServerErrorException,
} from "@utils/exceptions";
// Model(s) import
import db from "@db/index";
const DB: any = db;
const { User, Sensor, UserSensorAccess, UserSensorRequest } = DB;
// --- End of model(s) import
import { Status } from "#/sensor";
import { FindAttributeOptions, OrderItem } from "sequelize";
//import { sendMail } from "@/utils/mail";

const verifyUser = async (userName: string) => {
  const user = await User.findOne({ where: { email: userName } });
  if (!user) {
    throw new NotFoundException("User not found", "user.not.found");
  }
  return user;
};

const getSensorTopicFromName = (sensorName: string): string => {
  return `${sensorName}-topic`;
};

const verifySensor = async (sensorName: string) => {
  const sensor = await Sensor.findOne({ where: { name: sensorName } });
  if (!sensor) {
    throw new NotFoundException("Sensor not found", "sensor.not.found");
  }
  return sensor;
};

const addUsersToSensor = async (req: Request, res: Response) => {
  const { userName, sensorName, banned } = req.body;
  if (!userName || !sensorName) {
    return res
      .status(400)
      .json(
        new BadRequestException(
          "Missing user or sensor name",
          "userSensor.user.id.required"
        )
      );
  }

  try {
    const sensor = await verifySensor(sensorName);
    const user = await verifyUser(userName);
    const willBeBanned = banned?.toLowerCase() == "true";
    const status = willBeBanned ? Status.REFUSED : Status.ACCEPTED;
    const check = await UserSensorAccess.findOne({
      where: {
        userId: user.dataValues.id,
        sensorId: sensor.dataValues.id,
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

    const secondCheck = await UserSensorAccess.findOne({
      where: {
        userId: user.dataValues.id,
        sensorId: sensor.dataValues.id,
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
    const result = await UserSensorAccess.update(
      { status: status },
      { where: { userId: user.dataValues.id, sensorId: sensor.dataValues.id } }
    );
    if (!result) {
      return res
        .status(500)
        .json(new ServerErrorException("Server error", "server.error"));
    }

    /*const { error } = await sendMail(
      userName,
      "UMONS",
      "Your request has been " + (willBeBanned ? "refused" : "accepted")
    );

    if (error) {
      return res
        .status(207)
        .json(
          new MultiStatusException("Mail not sent", "userSensor.mail.not.sent")
        );
    }*/

    return res.status(201).json({ message: "User added to sensor" });
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

const removeUserFromSensor = async (req: Request, res: Response) => {
  const { userName, sensorName } = req.body;
  if (!userName || !sensorName) {
    return res
      .status(400)
      .json(
        new BadRequestException(
          "Missing user or sensor name",
          "userSensor.user.id.required"
        )
      );
  }
  try {
    const sensor = await verifySensor(sensorName);
    const user = await verifyUser(userName);
    const result = await UserSensorAccess.destroy({
      where: {
        userId: user.dataValues.id,
        sensorId: sensor.dataValues.id,
      },
    });
    if (!result) {
      return res
        .status(500)
        .json(new ServerErrorException("Server error", "server.error"));
    }
    return res.status(200).json({ message: "User removed from sensor" });
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

const getUserSensorsAccess = async (req: Request, res: Response) => {
  const { status, user, sensor, number } = req.body;

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

  if (sensor && typeof sensor === "string") {
    includeOptions.push({
      model: Sensor,
      attributes: ["name"],
      where: { name: sensor },
    });
  } else {
    includeOptions.push({
      model: Sensor,
      attributes: ["name"],
    });
  }
  const whereOptions = [];
  if (status && typeof status === "string") {
    whereOptions.push({
      status: status,
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
    "status",
    "createdAt",
  ] as FindAttributeOptions;

  try {
    const result =
      numberInt > 0
        ? await UserSensorAccess.findAll({
            include: includeOptions,
            attributes: attributesOptions,
            where: whereOptions,
            order: orderOptions,
            limit: numberInt,
          })
        : await UserSensorAccess.findAll({
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

const askForSensorAccess = async (req: Request, res: Response) => {
  const { user, sensor } = req.body;
  if (!user || !sensor) {
    return res
      .status(400)
      .json(
        new BadRequestException(
          "Missing user or sensor name",
          "userSensor.user.id.required"
        )
      );
  }
  try {
    const sensorTmp = await verifySensor(sensor);
    const userTmp = await verifyUser(user);
    const check = await UserSensorAccess.findOne({
      where: {
        userId: userTmp.dataValues.id,
        sensorId: sensorTmp.dataValues.id,
      },
    });
    if (check) {
      return res
        .status(400)
        .json(
          new BadRequestException(
            "User already has asked for access",
            "userSensor.user.already.has.asked"
          )
        );
    }
    const result = await UserSensorAccess.create({
      userId: userTmp.dataValues.id,
      sensorId: sensorTmp.dataValues.id,
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

async function verifySensorAvailable(sensor: string) {
  return (
    !!(await UserSensorRequest.findOne({
      where: {
        sensorName: sensor,
      },
    })) ||
    !!(await Sensor.findOne({
      where: {
        name: sensor,
      },
    }))
  );
}

const askForSensorCreation = async (req: Request, res: Response) => {
  const { user, sensor } = req.body;
  if (!user || !sensor) {
    return res
      .status(400)
      .json(
        new BadRequestException(
          "Missing user or sensor name",
          "userSensor.user.id.required"
        )
      );
  }
  try {
    const userTmp = await verifyUser(user);
    if (await verifySensorAvailable(sensor)) {
      return res
        .status(400)
        .json(
          new BadRequestException(
            "Sensor already exists",
            "userSensor.sensor.already.exists"
          )
        );
    }
    const check = await UserSensorRequest.findOne({
      where: {
        userId: userTmp.dataValues.id,
        sensorName: sensor,
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
    const result = await UserSensorRequest.create({
      userId: userTmp.dataValues.id,
      sensorName: sensor,
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

const getUserSensorRequests = async (req: Request, res: Response) => {
  const { user, sensor, status, number } = req.body;

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

  if (sensor && typeof sensor === "string") {
    whereOptions.push({
      sensorName: sensor,
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
    "sensorName",
    "status",
    "createdAt",
  ] as FindAttributeOptions;

  try {
    const result =
      numberInt > 0
        ? await UserSensorRequest.findAll({
            include: includeOptions,
            attributes: attributesOptions,
            where: whereOptions,
            order: orderOptions,
            limit: numberInt,
          })
        : await UserSensorRequest.findAll({
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

const createSensorForUser = async (req: Request, res: Response) => {
  const { userName, sensorName, banned } = req.body;
  if (!userName || !sensorName) {
    return res
      .status(400)
      .json(
        new BadRequestException(
          "Missing user or sensor name",
          "userSensor.user.id.required"
        )
      );
  }

  try {
    const user = await verifyUser(userName);
    const willBeBanned = banned?.toLowerCase() == "true";
    const status = willBeBanned ? Status.REFUSED : Status.ACCEPTED;
    const check = await UserSensorRequest.findOne({
      where: {
        userId: user.dataValues.id,
        sensorName,
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

    const secondCheck = await UserSensorRequest.findOne({
      where: {
        userId: user.dataValues.id,
        sensorName,
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

    const result = await UserSensorRequest.update(
      { status: status },
      { where: { userId: user.dataValues.id, sensorName } }
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
      const result2 = await Sensor.findOne({
        where: {
          name: sensorName,
        },
      });
      if (!result2) {
        return res
          .status(500)
          .json(new ServerErrorException("Server error", "server.error"));
      }

      const result3 = await Sensor.destroy({
        where: {
          name: sensorName,
        },
      });
      if (!result3) {
        return res
          .status(500)
          .json(new ServerErrorException("Server error", "server.error"));
      }
    } else {
      const result2 = await Sensor.create({
        name: sensorName,
        topic: getSensorTopicFromName(sensorName),
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
  verifySensor,
  addUsersToSensor,
  removeUserFromSensor,
  getUserSensorsAccess,
  askForSensorAccess,
  askForSensorCreation,
  getUserSensorRequests,
  createSensorForUser,
};
