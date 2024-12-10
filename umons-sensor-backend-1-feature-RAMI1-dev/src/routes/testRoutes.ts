import express from "express";

import {
  getAllRoleWithWorseRole,
  haveRightsToAcessToAdminPanel,
  updateRole,
} from "@controllers/user";

const router = express.Router();

router
  .put("/update/role", updateRole)
  .get("/verify/adminPanel", haveRightsToAcessToAdminPanel)
  .get("/all", getAllRoleWithWorseRole);

export { router as testRoutes };
