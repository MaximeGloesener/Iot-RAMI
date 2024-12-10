import { Sequelize } from "sequelize";
import type { SessionCreation, SessionModel, SessionStatic } from "#/session";

const defineSessionDataModel = (
  sequelize: Sequelize,
  DataTypes: any
): SessionStatic => {
  const Session = <SessionStatic>sequelize.define<
    SessionModel,
    SessionCreation
  >(
    "Session",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      idUser: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      idSensor: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      endedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
    }
  );

  Session.associate = (models: any) => {
    Session.belongsTo(models.User, {
      foreignKey: "idUser",
      targetKey: "id",
    });

    Session.belongsTo(models.Sensor, {
      foreignKey: "idSensor",
      targetKey: "id",
    });
  };

  return Session;
};

export default defineSessionDataModel;
