import { Request, Response } from "express";
// Model import
import db from "@db/index";
const DB: any = db;
const { Sensor } = DB;
// --- end of model import
import MqttServer from "@service/mqttServer";
import { RESPONSES } from "@/utils/mqttConstant";

const pingSensor = async (req: Request, res: Response) => {
  const { sensorName } = req.params;

  try {
    const sensor = await Sensor.findOne({ where: { name: sensorName } });

    if (!sensor) {
      return res.status(400).json({ message: "Invalid sensor name" });
    }

    const topic = sensor.topic;

    const MqttServerInstance: MqttServer = await MqttServer.getInstance();
    const sensorResponse = await MqttServerInstance.sendPingSignal(topic);

    if (sensorResponse === RESPONSES.PONG) {
      return res.send({ message: "online" });
    } else if (sensorResponse === RESPONSES.PONG_PUBLISHING) {
      return res.send({ message: "publishing" });
    } else {
      return res.send({ message: "offline" });
    }
  } catch (error) {
    return res.status(500).send({ error: "unexpected error" });
  }
};

export { pingSensor };
