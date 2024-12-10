import express from "express";

import {
  getAllRoleWithWorseRole,
  haveRightsToAcessToAdminPanel,
  login,
  signup,
  updateUserInformation,
  updateRole,
  getUserSessions,
} from "@controllers/user";
import { auth, authAdmin } from "@middlewares/auth";
import {
  addUsersToSensor,
  askForSensorAccess,
  askForSensorCreation,
  createSensorForUser,
  getUserSensorRequests,
  getUserSensorsAccess,
  removeUserFromSensor,
} from "@controllers/userSensor";
import {
  askForMeasurementTypeCreation,
  createMeasurementTypeForUser,
  getUserMeasurementTypeRequests,
} from "@controllers/userMeasurementType";

const router = express.Router();

router
  .post("/login", login)
  .post("/signup", signup)
  .put("/update", auth, updateUserInformation)
  .put("/update/role", auth, updateRole)
  .get("/verify/adminPanel", auth, haveRightsToAcessToAdminPanel)
  .get("/all", auth, getAllRoleWithWorseRole)
  .get("/:id/sessions", getUserSessions)
  .get("/:id/sessions/on/sensor/:idSensor", getUserSessions)
  .post("/sensors/access", auth, addUsersToSensor)
  .delete("/sensors/access", auth, removeUserFromSensor)
  .get("/sensors/access", authAdmin, getUserSensorsAccess)
  .post("/sensors/access/ask", auth, askForSensorAccess)
  .post("/sensors/creation/ask", auth, askForSensorCreation)
  .get("/sensors/creation", authAdmin, getUserSensorRequests)
  .post("/sensors/creation", authAdmin, createSensorForUser)
  .post("/measurementTypes/creation/ask", auth, askForMeasurementTypeCreation)
  .get("/measurementTypes/creation", authAdmin, getUserMeasurementTypeRequests)
  .post("/measurementTypes/creation", authAdmin, createMeasurementTypeForUser);

export { router as userRoutes };
