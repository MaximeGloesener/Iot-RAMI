import express from "express";
import { pingSensor } from "@controllers/mqttClientOverWebSocket";

const router = express.Router();
router.get("/online/:sensorName", pingSensor);

export { router as mqttClientServorRoutes };
