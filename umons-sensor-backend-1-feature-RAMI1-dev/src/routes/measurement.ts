import express from "express";
import {
  createMeasurement,
  createMeasurements,
  deleteMeasurement,
  getMeasurement,
  updateMeasurement,
} from "@controllers/measurement";
//import { auth } from "@middlewares/auth";

const router = express.Router();

router
  // Ajouté de auth ici, en 2-1-2 ????
  .get("/:id?", getMeasurement)
  .post("/", createMeasurement)
  .post("/bulk", createMeasurements)
  .put("/:id", updateMeasurement)
  .delete("/:id", deleteMeasurement);

export { router as measurementRoutes };
