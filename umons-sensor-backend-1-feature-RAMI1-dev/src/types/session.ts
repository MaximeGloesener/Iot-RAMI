import { Model, BuildOptions } from "sequelize";

/** ============================ PLEASE READ THIS PART IN ORDER TO UNDERSTAND THE SESSION MODEL MANAGEMENT ============================
The session model represents the interval of use of a sensor between t1 and t2 by a person. A session is valid
only if the user started it and then stopped it. And this is where we can write it into the database.
So, as long as the session is not stopped on the browser side, it is not saved in DB
 */

interface SessionCreation {
  id: string;
  idUser: string;
  idSensor: string;
  createdAt: Date;
  endedAt: Date;
}

interface Session {
  id: string;
  idUser: string;
  idSensor: string;
  createdAt: Date;
  updatedAt: Date;
}

type SessionModel = Model<Session, SessionCreation>;

// Allow you to define a static method to define associations at the model class level
type SessionStatic = typeof Model & {
  associate?: (models: any) => void;
} & {
  new (values?: Record<string, unknown>, options?: BuildOptions): SessionModel;
};

export type { Session, SessionCreation, SessionModel, SessionStatic };
