import { Request, Response } from "express";
import {
  BadRequestException,
  NotFoundException,
  ServerErrorException,
  UnauthorizedException,
} from "@utils/exceptions";
// Model(s) import
import db from "@db/index";
const DB: any = db;
const { User, Session } = DB;
// --- End of model(s) import
import {
  isBetterThan,
  isStrictlyBetterThan,
  Role,
  Sex,
  User as UserType,
  UserPayload,
} from "#/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { envs } from "@utils/env";

const checkPasswordLength = (password: string) => {
  if (password.length < 12) {
    throw new BadRequestException(
      "Password too short !",
      "user.password.too.short"
    );
  }

  if (password.length > 255) {
    throw new BadRequestException(
      "Password too long !",
      "user.password.too.long"
    );
  }
};

const checkFirstNameLength = (firstName: string) => {
  if (firstName.length > 60) {
    throw new BadRequestException(
      "First Name too long !",
      "user.first.name.too.long"
    );
  }

  if (firstName.length < 2) {
    throw new BadRequestException(
      "First Name too short !",
      "user.first.name.too.short"
    );
  }
};

const checkLastNameLength = (lastName: string) => {
  if (lastName.length > 60) {
    throw new BadRequestException(
      "Last Name too long !",
      "user.last.name.too.long"
    );
  }

  if (lastName.length < 2) {
    throw new BadRequestException(
      "Last Name too short !",
      "user.last.name.too.short"
    );
  }
};

const checkSex = (sex: string) => {
  if (!Object.values(Sex).includes(sex as Sex)) {
    throw new BadRequestException("User sex is invalid!", "user.sex.invalid");
  }
};

const checkEmail = (email: string) => {
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    throw new BadRequestException("Invalid email !", "user.email.not.valid");
  }
};

const checkDate = (date: string) => {
  if (!new Date(date).getTime()) {
    throw new BadRequestException(
      "Invalid date format!",
      "user.date.of.birth.not.valid"
    );
  }
};

const generateUserResponse = (user: UserType, token?: string) => {
  if (!token) {
    const secret = envs.JWT_SECRET;
    const payload = {
      userId: user.id,
      role: user.role,
    };
    token = jwt.sign(payload, secret, {
      expiresIn: envs.JWT_EXPIRATION,
    });
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    dateOfBirth: user.dateOfBirth,
    sex: user.sex,
    role: user.role,
    expiresAt: Date.now() + 12 * 60 * 60 * 1000,
    token,
  };
};

const signup = async (req: Request, res: Response) => {
  try {
    // Check if body is valid
    const { firstName, lastName, dateOfBirth, sex, email, password } = req.body;
    if (
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !sex ||
      !email ||
      !password ||
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof dateOfBirth !== "string" ||
      typeof sex !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      firstName === "" ||
      lastName === "" ||
      dateOfBirth === "" ||
      sex === "" ||
      email === "" ||
      password === ""
    ) {
      throw new BadRequestException("Invalid body !", "user.body.invalid");
    }

    checkPasswordLength(password);
    checkFirstNameLength(firstName);
    checkLastNameLength(lastName);
    checkDate(dateOfBirth);
    checkSex(sex);
    checkEmail(email);

    // Check email does not already exist
    const user = await User.findOne({ where: { email } });
    if (user) {
      throw new BadRequestException(
        "Email already used !",
        "user.email.already.used"
      );
    }

    // Create user with hashed password
    const hashedPassword = await bcrypt.hash(password, envs.BCRYPT_SALT_ROUNDS);
    const newUser = await User.create({
      firstName,
      lastName,
      dateOfBirth: new Date(dateOfBirth),
      sex,
      email,
      password: hashedPassword,
      role: Role.REGULAR,
    });

    const responseData = generateUserResponse(newUser);
    return res.status(201).json(responseData);
  } catch (error) {
    if (error instanceof BadRequestException) {
      return res.status(400).json(error);
    } else {
      return res
        .status(500)
        .json(new ServerErrorException("Server error !", "server.error"));
    }
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let statusCode = 200;
  let responseData = {};
  if (
    !email ||
    !password ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    email === "" ||
    password === ""
  ) {
    statusCode = 400;
    responseData = new BadRequestException(
      "Invalid credentials !",
      "user.credentials.invalid"
    );
  } else {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        statusCode = 400;
        responseData = new BadRequestException(
          "Invalid email or password !",
          "user.credentials.invalid"
        );
      } else {
        // Compare hashed password
        let result = false;
        if (typeof user.dataValues.password === "string") {
          result = await bcrypt.compare(password, user.dataValues.password);
        }
        if (result) {
          responseData = generateUserResponse(user);
        } else {
          statusCode = 400;
          responseData = new BadRequestException(
            "Invalid email or password !",
            "user.credentials.invalid"
          );
        }
      }
    } catch (e) {
      statusCode = 500;
      responseData = new ServerErrorException("Server error !", "server.error");
    }
  }
  return res.status(statusCode).json(responseData);
};

const updateUserInformation = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, sex, email, password, newPassword } = req.body;
    const token = req.headers.authorization?.split(" ")[1]; // extract token from header bearer

    if (!token) {
      return res
        .status(400)
        .json(
          new BadRequestException("No token provided !", "auth.token.not.found")
        );
    }

    if (
      !firstName ||
      !lastName ||
      !sex ||
      !email ||
      !password ||
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof sex !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      firstName === "" ||
      lastName === "" ||
      sex === "" ||
      email === "" ||
      password === ""
    ) {
      return res
        .status(400)
        .json(new BadRequestException("Invalid body !", "user.body.invalid"));
    }

    if (newPassword && typeof newPassword !== "string") {
      return res
        .status(400)
        .json(new BadRequestException("Invalid body !", "user.body.invalid"));
    }

    try {
      checkFirstNameLength(firstName);
      checkLastNameLength(lastName);
      checkSex(sex);
      checkEmail(email);

      if (newPassword) {
        checkPasswordLength(newPassword);
      }
    } catch (error) {
      return res.status(400).json(error);
    }

    // Now, we need to get the current user
    // 1) We get the current user id by using the payload
    const secret = envs.JWT_SECRET;
    const payload = jwt.verify(token, secret) as UserPayload;
    if (!payload) {
      return res
        .status(401)
        .json(
          new UnauthorizedException(
            "Unauthorized (invalid token) !",
            "auth.token.invalid"
          )
        );
    }

    const currentUserId = payload.userId;

    // 2) Let's find the user in the database
    const user = await User.findByPk(currentUserId);
    if (!user) {
      return res
        .status(400)
        .json(new BadRequestException("User not found !", "user.not.found"));
    }

    // Check email does not already exist (and if exists, this is not our current user's)
    const userWithCorrespondingEmail = await User.findOne({ where: { email } });
    if (userWithCorrespondingEmail) {
      // Ok, we find out a user with the corresponding email. But if it's our current User, this is not a problem !!!
      if (user.id !== userWithCorrespondingEmail.id) {
        return res
          .status(400)
          .json(
            new BadRequestException(
              "Email already used !",
              "user.email.already.used"
            )
          );
      }
    }

    // Here, we check that the current user password is the same as the one precised by the client
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json(
          new UnauthorizedException(
            "Invalid credentials !",
            "user.credentials.invalid"
          )
        );
    }

    // You can update your profile without defining a new password, but you can also give a new password
    const updatedData: any = {
      firstName,
      lastName,
      sex,
      email,
    };

    if (newPassword) {
      updatedData.password = await bcrypt.hash(
        newPassword,
        envs.BCRYPT_SALT_ROUNDS
      );
    }

    const updatedUser = await user.update(updatedData);

    if (!updatedUser) {
      return res
        .status(500)
        .json(new ServerErrorException("Server error !", "server.error"));
    }

    const responseData = generateUserResponse(updatedUser, token);
    return res.status(200).json(responseData);
  } catch (error) {
    return res
      .status(500)
      .json(new ServerErrorException("Server error !", "server.error"));
  }
};

const updateRole = async (req: Request, res: Response) => {
  const { email, role } = req.body;
  const token = req.headers.authorization?.split(" ")[1]; // extract token from header bearer
  const roleEnum = role as Role;

  if (!token) {
    return res
      .status(400)
      .json(
        new BadRequestException("No token provided !", "auth.token.not.found")
      );
  }

  if (
    !email ||
    !role ||
    typeof email !== "string" ||
    typeof role !== "string" ||
    email === "" ||
    role === ""
  ) {
    return res
      .status(400)
      .json(new BadRequestException("Invalid body !", "user.body.invalid"));
  }

  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res
      .status(400)
      .json(new BadRequestException("Invalid email !", "user.email.not.valid"));
  }

  if (!Object.values(Role).includes(roleEnum)) {
    // check if role is valid (ADMIN, PRIVILEGED, REGULAR)
    return res
      .status(400)
      .json(new BadRequestException("Invalid role !", "user.role.not.valid"));
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json(new BadRequestException("User not found !", "user.not.found"));
    }

    const secret = envs.JWT_SECRET;
    const payload = jwt.verify(token, secret) as UserPayload;
    if (!payload) {
      return res
        .status(401)
        .json(
          new UnauthorizedException(
            "Unauthorized (invalid token) !",
            "auth.token.invalid"
          )
        );
    }
    if (isStrictlyBetterThan(payload.role, roleEnum)) {
      return res
        .status(401)
        .json(
          new UnauthorizedException(
            "You can't update a user with a better role than you !",
            "user.role.not.enough.permissions"
          )
        );
    }
    const updatedUser = await User.update(
      { role: roleEnum },
      { where: { email } }
    );
    if (!updatedUser) {
      return res
        .status(500)
        .json(new ServerErrorException("Server error !", "server.error"));
    }
    return res
      .status(200)
      .json({ message: "User updated with role " + roleEnum + " !" });
  } catch (error) {
    return res
      .status(500)
      .json(new ServerErrorException("Server error !", "server.error"));
  }
};

const haveRightsToAcessToAdminPanel = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1]; // extract token from header bearer

  if (!token) {
    return res
      .status(400)
      .json(
        new BadRequestException("No token provided !", "auth.token.not.found")
      );
  }

  try {
    const decodedToken = (await jwt.decode(token)) as UserPayload;
    if (!decodedToken) {
      return res
        .status(400)
        .json(new BadRequestException("Invalid token !", "auth.token.invalid"));
    }
    if (isBetterThan(decodedToken.role, Role.PRIVILEGED)) {
      return res
        .status(401)
        .json(
          new UnauthorizedException(
            "You don't have enough rights to access to admin panel !",
            "user.role.not.enough.permissions"
          )
        );
    }
    return res
      .status(200)
      .json({ message: "You have enough rights to access to admin panel !" });
  } catch (error) {
    return res
      .status(500)
      .json(new ServerErrorException("Server error !", "server.error"));
  }
};

const getAllRoleWithWorseRoleThan = (role: Role) => {
  const roles = Object.values(Role);
  const index = roles.indexOf(role);
  if (index === -1 || index === roles.length - 1) {
    return [];
  }
  return roles.slice(index + 1, roles.length);
};

const getAllRoleWithWorseRole = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1]; // extract token from header bearer

  if (!token) {
    return res
      .status(400)
      .json(
        new BadRequestException("No token provided !", "auth.token.not.found")
      );
  }

  try {
    const decodedToken = jwt.decode(token) as UserPayload;
    if (!decodedToken) {
      return res
        .status(400)
        .json(new BadRequestException("Invalid token !", "auth.token.invalid"));
    }
    const roles = getAllRoleWithWorseRoleThan(decodedToken.role);
    if (roles.length === 0) {
      return res
        .status(401)
        .json(
          new UnauthorizedException(
            "You don't have enough rights to get all users with worse role than you !",
            "user.role.not.enough.permissions"
          )
        );
    }
    const users = await User.findAll({ where: { role: roles } });
    if (!users) {
      return res
        .status(404)
        .json(new NotFoundException("No user found !", "user.not.found"));
    }
    return res.status(200).json(users);
  } catch (error) {
    return res
      .status(500)
      .json(new ServerErrorException("Server error !", "server.error"));
  }
};

const getUserSessions = async (req: Request, res: Response) => {
  const { id, idSensor } = req.params;

  try {
    // Let's find out the user
    const user = await User.findByPk(id);

    if (!user) {
      return res
        .status(404)
        .json(new BadRequestException("User not found !", "user.not.found"));
    }

    const whereClause: any = { idUser: id };

    if (idSensor) {
      whereClause.idSensor = idSensor;
    }

    const userSessions = await Session.findAll({ where: whereClause });

    return res.status(200).json(userSessions);
  } catch (error) {
    console.error("Error fetching session:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  signup,
  login,
  updateUserInformation,
  updateRole,
  haveRightsToAcessToAdminPanel,
  getAllRoleWithWorseRole,
  getUserSessions,
  generateUserResponse,
};
