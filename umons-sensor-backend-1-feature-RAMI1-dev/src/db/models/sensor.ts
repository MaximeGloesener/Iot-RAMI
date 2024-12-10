import { Sequelize } from "sequelize";
import type { SensorCreation, SensorModel, SensorStatic } from "#/sensor";

const defineSensorModel = (
  sequelize: Sequelize,
  DataTypes: any
): SensorStatic => {
  const Sensor = <SensorStatic>sequelize.define<SensorModel, SensorCreation>(
    "Sensor",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      topic: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: true,
    }
  );

  Sensor.associate = (models: any) => {
    Sensor.hasMany(models.UserSensorAccess, {
      foreignKey: "sensorId",
      sourceKey: "id",
    });

    Sensor.hasMany(models.sensordata, {
      foreignKey: "idSensor",
      sourceKey: "id",
    });

    Sensor.hasMany(models.Session, { foreignKey: "idSensor" });
  };

  return Sensor;
};
export default defineSensorModel;
