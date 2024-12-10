import express from "express";
import { auth } from "@middlewares/auth";

const router = express.Router();

router.route("/").post(auth, (_req, res) => {
  res.status(201).json({
    message: "Auth route !",
  });
});

export { router as authRoutes };
