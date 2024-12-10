import { Sequelize } from "sequelize";
import { Status } from "#/sensor";
import {
  UserMeasurementTypeRequestCreation,
  UserMeasurementTypeRequestModel,
  UserMeasurementTypeRequestStatic,
} from "#/measurementType";

const defineUserMeasurementTypeRequestModel = (
  sequelize: Sequelize,
  DataTypes: any
): UserMeasurementTypeRequestStatic => {
  const UserMeasurementTypeRequest = <UserMeasurementTypeRequestStatic>(
    sequelize.define<
      UserMeasurementTypeRequestModel,
      UserMeasurementTypeRequestCreation
    >(
      "UserMeasurementTypeRequest",
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        measurementType: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM(Status.PENDING, Status.ACCEPTED, Status.REFUSED),
          defaultValue: Status.PENDING,
        },
        createdAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        timestamps: false,
      }
    )
  );

  UserMeasurementTypeRequest.associate = (models: any) => {
    UserMeasurementTypeRequest.belongsTo(models.User, {
      foreignKey: "userId",
      targetKey: "id",
    });
  };

  return UserMeasurementTypeRequest;
};

export default defineUserMeasurementTypeRequestModel;
