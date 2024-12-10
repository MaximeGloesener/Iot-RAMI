import express from "express";
import {
  createSensor,
  deleteSensor,
  getSensor,
  updateSensor,
  getSensorSessions,
  getSensorTopic,
} from "@controllers/sensor";
//import { auth, authAdmin } from "@middlewares/auth";

const router = express.Router();

router
  .route("/:id?")
  .post(createSensor) // authAdmin
  .get(getSensor) //auth pour le reste
  .put(updateSensor)
  .delete(deleteSensor);
// Depend at least on two models
router.get("/:id/sessions", getSensorSessions);
router.get("/:id/topic", getSensorTopic);

export { router as sensorRoutes };
