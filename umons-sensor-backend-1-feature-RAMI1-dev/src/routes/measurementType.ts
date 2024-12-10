import express from "express";
import {
  createMeasurementType,
  deleteMeasurementType,
  getMeasurementType,
  updateMeasurementType,
} from "@controllers/measurementType";

const router = express.Router();

router
  .route("/:id?")
  .post(createMeasurementType)
  .get(getMeasurementType)
  .put(updateMeasurementType)
  .delete(deleteMeasurementType);

export { router as measurementTypeRoutes };
