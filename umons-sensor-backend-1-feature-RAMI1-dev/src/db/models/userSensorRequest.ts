import { Sequelize } from "sequelize";
import {
  Status,
  UserSensorRequestCreation,
  UserSensorRequestModel,
  UserSensorRequestStatic,
} from "#/sensor";

const defineUserSensorRequestModel = (
  sequelize: Sequelize,
  DataTypes: any
): UserSensorRequestStatic => {
  const UserSensorRequest = <UserSensorRequestStatic>sequelize.define<
    UserSensorRequestModel,
    UserSensorRequestCreation
  >(
    "UserSensorRequest",
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
      sensorName: {
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
  );

  UserSensorRequest.associate = (models: any) => {
    UserSensorRequest.belongsTo(models.User, {
      foreignKey: "userId",
      targetKey: "id",
    });
  };

  return UserSensorRequest;
};

export default defineUserSensorRequestModel;
