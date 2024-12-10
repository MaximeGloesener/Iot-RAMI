import { Request, Response } from "express";
import {
  BadRequestException,
  ServerErrorException,
  UnauthorizedException,
} from "@utils/exceptions";
import jwt from "jsonwebtoken";
import { UserPayload } from "#/user";
import { envs } from "@utils/env";

const verifyToken = (req: Request) => {
  // Check if token is valid (in header in bearer format)
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new BadRequestException("Invalid token !", "auth.token.invalid");
  }
  const secret = envs.JWT_SECRET;

  const payload = jwt.verify(token, secret) as UserPayload;
  if (!payload) {
    throw new UnauthorizedException("Unauthorized !", "auth.token.invalid");
  }
};

const auth = (req: Request, res: Response, next: () => void) => {
  try {
    verifyToken(req);
    next();
  } catch (error) {
    switch (true) {
      case error instanceof BadRequestException:
        res.status(400).json(error);
        break;
      case error instanceof UnauthorizedException:
        res.status(401).json(error);
        break;
      default:
        res
          .status(500)
          .json(new ServerErrorException("Server error !", "server.error"));
        break;
    }
  }
};

const authAdmin = (req: Request, res: Response, next: () => void) => {
  try {
    verifyToken(req);
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res
        .status(400)
        .json(new BadRequestException("Invalid token !", "auth.token.invalid"));
      return;
    }

    const secret = envs.JWT_SECRET;

    const payload = jwt.verify(token, secret) as UserPayload;
    if (payload.role !== "admin") {
      res
        .status(401)
        .json(
          new UnauthorizedException("Unauthorized !", "auth.token.unauthorized")
        );
      return;
    }
    next();
  } catch (error) {
    switch (true) {
      case error instanceof BadRequestException:
        res.status(400).json(error);
        break;
      case error instanceof UnauthorizedException:
        res.status(401).json(error);
        break;
      default:
        res
          .status(500)
          .json(new ServerErrorException("Server error !", "server.error"));
        break;
    }
  }
};

export { auth, verifyToken, authAdmin };
