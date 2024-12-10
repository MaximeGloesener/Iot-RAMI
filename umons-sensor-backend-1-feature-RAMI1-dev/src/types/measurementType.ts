import { Model, BuildOptions } from "sequelize";
import { Status } from "#/sensor";

// MeasurementType

interface MeasurementTypeCreation {
  id?: string;
  name?: string;
}

interface MeasurementType {
  id: string;
  name: string;
}

type MeasurementTypeModel = Model<MeasurementType, MeasurementTypeCreation>;

// Allow you to define a static method to define associations at the model class level
type MeasurementTypeStatic = typeof Model & {
  associate?: (models: any) => void;
} & {
  new (
    values?: Record<string, unknown>,
    options?: BuildOptions
  ): MeasurementTypeModel;
};

/****************************/
// UserMeasurementTypeRequest

interface UserMeasurementTypeRequestCreation {
  id?: string;
  userId: string;
  measurementType: string;
  status?: Status;
  createdAt?: Date;
}

interface UserMeasurementTypeRequest {
  id: string;
  userId: string;
  measurementType: string;
  status: Status;
  createdAt: Date;
}

type UserMeasurementTypeRequestModel = Model<
  UserMeasurementTypeRequest,
  UserMeasurementTypeRequestCreation
>;

// Allow you to define a static method to define associations at the model class level
type UserMeasurementTypeRequestStatic = typeof Model & {
  associate?: (models: any) => void;
} & {
  new (
    values?: Record<string, unknown>,
    options?: BuildOptions
  ): UserMeasurementTypeRequestModel;
};

export type {
  MeasurementType,
  MeasurementTypeCreation,
  MeasurementTypeModel,
  MeasurementTypeStatic,
  UserMeasurementTypeRequest,
  UserMeasurementTypeRequestCreation,
  UserMeasurementTypeRequestModel,
  UserMeasurementTypeRequestStatic,
};
