import { Request, Response } from "express";
// Model(s) import
import db from "@db/index";
const DB: any = db;
const { Sensor, Session } = DB;
// --- End of model(s) import
import {
  BadRequestException,
  NotFoundException,
  ServerErrorException,
} from "@utils/exceptions";
import { Role } from "#/user";
import { decodeToken, getSensorsAvailable } from "@controllers/measurement";

const checkName = (name: string) => {
  if (!name) {
    throw new BadRequestException("Name is required", "sensor.name.required");
  }

  if (name.length > 255) {
    throw new BadRequestException("Name is too long", "sensor.name.too.long");
  }
  if (name.length < 3) {
    throw new BadRequestException("Name is too short", "sensor.name.too.short");
  }
};

const checkTopic = (topic: string) => {
  if (!topic) {
    throw new BadRequestException("Topic is required", "topic.name.required");
  }

  if (topic.length > 255) {
    throw new BadRequestException("Topic is too long", "topic.name.too.long");
  }
  if (topic.length < 3) {
    throw new BadRequestException("Topic is too short", "topic.name.too.short");
  }
};

const checkId = (id: string) => {
  if (!id) {
    throw new BadRequestException("Id is required", "sensor.id.required");
  }

  if (id.length !== 36) {
    throw new BadRequestException(
      "Id must be a valid uuid",
      "sensor.id.not.uuid"
    );
  }
};

const checkIfNameExists = async (name: string) => {
  try {
    const sensor = await Sensor.findOne({ where: { name } });
    if (sensor) {
      throw new BadRequestException(
        "Sensor already exists",
        "sensor.already.exists"
      );
    }
  } catch (error) {
    throw error instanceof BadRequestException
      ? error
      : new ServerErrorException("Server error", "server.error");
  }
};

const checkIfTopicExists = async (topic: string) => {
  try {
    const sensor = await Sensor.findOne({ where: { topic } });
    if (sensor) {
      throw new BadRequestException(
        "Topic already exists",
        "topic.already.exists"
      );
    }
  } catch (error) {
    throw error instanceof BadRequestException
      ? error
      : new ServerErrorException("Server error", "server.error");
  }
};

const createSensor = async (req: Request, res: Response) => {
  const { name, topic } = req.body;
  try {
    checkName(name);
    checkTopic(topic);
  } catch (error) {
    return res.status(400).json(error);
  }
  try {
    await checkIfNameExists(name);
    await checkIfTopicExists(topic);
  } catch (error) {
    return error instanceof BadRequestException
      ? res.status(400).json(error)
      : res
          .status(500)
          .json(new ServerErrorException("Server error", "server.error"));
  }

  try {
    const sensor = await Sensor.create({ name, topic });
    if (!sensor) {
      return res
        .status(500)
        .json(new ServerErrorException("Server error", "server.error"));
    }
    return res.status(201).json(sensor);
  } catch (error) {
    return res
      .status(500)
      .json(new ServerErrorException("Server error", "server.error"));
  }
};

const getSensor = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.query;
  let nameString = "";
  if (name) {
    nameString = name.toString();
  }

  const token = req.headers.authorization?.split(" ")[1]; // extract token from header bearer
  let isAdmin = false;
  let sensorsAvailableId: string[] = [];
  let sensorsAvailableName: string[] = [];

  try {
    const decodedToken = await decodeToken(token);
    isAdmin = decodedToken.role === Role.ADMIN;
    sensorsAvailableId = isAdmin ? [] : await getSensorsAvailable(decodedToken);
    sensorsAvailableName = isAdmin
      ? []
      : await getSensorsAvailable(decodedToken, true);
  } catch (e) {
    switch (true) {
      case e instanceof BadRequestException:
        return res.status(400).json(e);
      case e instanceof NotFoundException:
        return res.status(404).json(e);
      default:
        return res
          .status(500)
          .json(new ServerErrorException("Server error", "server.error"));
    }
  }
  if (!isAdmin && sensorsAvailableId.length === 0) {
    return res
      .status(403)
      .json(
        new NotFoundException(
          "You don't have access to any sensor",
          "sensor.not.found"
        )
      );
  }

  if (!isAdmin && id && !sensorsAvailableId.includes(id)) {
    return res
      .status(403)
      .json(
        new NotFoundException(
          "You don't have access to this sensor",
          "sensor.not.found"
        )
      );
  }

  if (
    !isAdmin &&
    nameString !== "" &&
    !sensorsAvailableName.includes(nameString)
  ) {
    return res
      .status(403)
      .json(
        new NotFoundException(
          "You don't have access to this sensor",
          "sensor.not.found"
        )
      );
  }

  try {
    // find one if there is an id or findAll if there is no id
    const sensors = id
      ? await Sensor.findByPk(id)
      : nameString !== ""
      ? await Sensor.findOne({ where: { name: nameString } })
      : isAdmin
      ? await Sensor.findAll()
      : await Sensor.findAll({ where: { id: sensorsAvailableId } });
    // if there is no sensor, throw an exception
    if (!sensors) {
      return res
        .status(404)
        .json(new NotFoundException("Sensor not found", "sensor.not.found"));
    }
    return res.status(200).json(sensors);
  } catch (error) {
    return res
      .status(500)
      .json(new ServerErrorException("Server error", "server.error"));
  }
};

const updateSensor = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, topic } = req.body;
  try {
    checkName(name);
    checkTopic(topic);
    checkId(id);
  } catch (error) {
    return res.status(400).json(error);
  }

  const token = req.headers.authorization?.split(" ")[1]; // extract token from header bearer
  let isAdmin = false;
  let sensorsAvailableId: string[] = [];

  try {
    const decodedToken = await decodeToken(token);
    isAdmin = decodedToken.role === Role.ADMIN;
    sensorsAvailableId = isAdmin ? [] : await getSensorsAvailable(decodedToken);
  } catch (e) {
    switch (true) {
      case e instanceof BadRequestException:
        return res.status(400).json(e);
      case e instanceof NotFoundException:
        return res.status(404).json(e);
      default:
        return res
          .status(500)
          .json(new ServerErrorException("Server error", "server.error"));
    }
  }

  if (!isAdmin && sensorsAvailableId.length === 0) {
    return res
      .status(403)
      .json(
        new NotFoundException(
          "You don't have access to any sensor",
          "sensor.not.found"
        )
      );
  }

  if (!isAdmin && id && !sensorsAvailableId.includes(id)) {
    return res
      .status(403)
      .json(
        new NotFoundException(
          "You don't have access to this sensor",
          "sensor.not.found"
        )
      );
  }

  try {
    const sensor = await Sensor.update({ name, topic }, { where: { id } });
    if (!sensor) {
      return res
        .status(400)
        .json(new NotFoundException("Sensor not found", "sensor.not.found"));
    }
    return res.status(200).json(sensor);
  } catch (error) {
    return res
      .status(500)
      .json(new ServerErrorException("Server error", "server.error"));
  }
};

const deleteSensor = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    checkId(id);
  } catch (error) {
    return res.status(400).json(error);
  }

  const token = req.headers.authorization?.split(" ")[1]; // extract token from header bearer
  let isAdmin = false;
  let sensorsAvailableId: string[] = [];

  try {
    const decodedToken = await decodeToken(token);
    isAdmin = decodedToken.role === Role.ADMIN;
    sensorsAvailableId = isAdmin ? [] : await getSensorsAvailable(decodedToken);
  } catch (e) {
    switch (true) {
      case e instanceof BadRequestException:
        return res.status(400).json(e);
      case e instanceof NotFoundException:
        return res.status(404).json(e);
      default:
        return res.status(500).json(e);
    }
  }

  if (!isAdmin && sensorsAvailableId.length === 0) {
    return res
      .status(403)
      .json(
        new NotFoundException(
          "You don't have access to any sensor",
          "sensor.not.found"
        )
      );
  }

  if (!isAdmin && id && !sensorsAvailableId.includes(id)) {
    return res
      .status(403)
      .json(
        new NotFoundException(
          "You don't have access to this sensor",
          "sensor.not.found"
        )
      );
  }

  try {
    const sensor = await Sensor.destroy({ where: { id } });
    if (!sensor) {
      return res
        .status(400)
        .json(new NotFoundException("Sensor not found", "sensor.not.found"));
    }
    return res.status(200).json({ message: "Sensor deleted" });
  } catch (error) {
    return res
      .status(500)
      .json(new ServerErrorException("Server error", "server.error"));
  }
};

const getSensorSessions = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Let's find out the sensoer
    const sensor = await Sensor.findByPk(id);
    if (!sensor) {
      return res
        .status(400)
        .json(new NotFoundException("Sensor not found", "sensor.not.found"));
    }

    const sensorSessions = await Session.findAll({
      where: { idSensor: sensor.id },
    });

    return res.status(200).json(sensorSessions);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSensorTopic = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Let's find out the sensoer
    const sensor = await Sensor.findByPk(id);
    if (!sensor) {
      return res
        .status(400)
        .json(new NotFoundException("Sensor not found", "sensor.not.found"));
    }

    const topicFromDB = sensor.topic;
    return res.status(200).json({
      topic: topicFromDB,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  createSensor,
  getSensor,
  updateSensor,
  deleteSensor,
  checkId,
  checkName,
  checkIfNameExists,
  checkTopic,
  checkIfTopicExists,
  getSensorSessions,
  getSensorTopic,
};
