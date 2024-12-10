import { Model, BuildOptions } from "sequelize";

// Sensor

interface SensorCreation {
  id?: string;
  name?: string;
  topic?: string;
  createdAt?: string; // We need to convert the Date to string
  updatedAt?: string; // We need to convert the Date to string
}

interface Sensor {
  id: string;
  name: string;
  topic: string;
  createdAt?: string; // We need to convert the Date to string
  updatedAt?: string; // We need to convert the Date to string
}

type SensorModel = Model<Sensor, SensorCreation>;

// Allow you to define a static method to define associations at the model class level
type SensorStatic = typeof Model & {
  associate?: (models: any) => void;
} & {
  new (values?: Record<string, unknown>, options?: BuildOptions): SensorModel;
};

/****************************/
// UserSensorAccess

enum Status {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REFUSED = "refused",
}

interface UserSensorAccessCreation {
  id?: string;
  userId: string;
  sensorId: string;
  status?: Status;
  createdAt?: Date;
}

interface UserSensorAccess {
  id: string;
  userId: string;
  sensorId: string;
  status: Status;
  createdAt: Date;
}

type UserSensorAccessModel = Model<UserSensorAccess, UserSensorAccessCreation>;

// Allow you to define a static method to define associations at the model class level
type UserSensorAccessStatic = typeof Model & {
  associate?: (models: any) => void;
} & {
  new (
    values?: Record<string, unknown>,
    options?: BuildOptions
  ): UserSensorAccessModel;
};

/****************************/
// UserSensorRequest

interface UserSensorRequestCreation {
  id?: string;
  userId: string;
  sensorName: string;
  status?: Status;
  createdAt?: Date;
}

interface UserSensorRequest {
  id: string;
  userId: string;
  sensorName: string;
  status: Status;
  createdAt: Date;
}

type UserSensorRequestModel = Model<
  UserSensorRequest,
  UserSensorRequestCreation
>;

// Allow you to define a static method to define associations at the model class level
type UserSensorRequestStatic = typeof Model & {
  associate?: (models: any) => void;
} & {
  new (
    values?: Record<string, unknown>,
    options?: BuildOptions
  ): UserSensorRequestModel;
};

export type {
  Sensor,
  SensorCreation,
  SensorModel,
  SensorStatic,
  UserSensorAccessModel,
  UserSensorAccess,
  UserSensorAccessCreation,
  UserSensorAccessStatic,
  UserSensorRequestModel,
  UserSensorRequest,
  UserSensorRequestCreation,
  UserSensorRequestStatic,
};

export { Status };
