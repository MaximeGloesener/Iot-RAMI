import type { Options } from "sequelize";
import { Sequelize, DataTypes, Model } from "sequelize";
import { envs } from "@utils/env";

import defineMeasurement from "@models/measurement";
import defineMeasurementType from "@models/measurementType";
import defineSensorModel from "@models/sensor";
import defineSensorDataModel from "@models/sensorData";
import defineSessionDataModel from "@models/session";
import defineUserModel from "@models/user";
import defineUserMeasurementTypeRequestModel from "@models/userMeasurementTypeRequest";
import defineUserSensorAccessModel from "@models/userSensorAccess";
import defineUserSensorRequestModel from "@models/userSensorRequest";

const options: Options = {
  dialect: "postgres",
  logging: false,
  host: envs.DB_HOST,
  port: envs.DB_PORT,
  database: envs.DB_NAME,
  username: envs.DB_USER,
  password: envs.DB_PASSWORD,
};
const sequelize = new Sequelize(options);

/* 
### RAMI1

The problem is that RAMI0 did not follow the sequelize documentation concerning the establishment of associations.
Therefore no join was possible. This part is precisely there to allow the addition of assoications. 

One last thing, RAMI0 defined associations "on one side only", theses are not valid, the sequelize documentation
specifies that setting up an association between two tables is done with the use of two keywords.
Please follow the sequelize documentation so that never happens again.
*/

const db: any = {};

type DefineModelFunction = (
  sequelize: Sequelize,
  DataTypes: any
) => typeof Model;

const addModelToDb = (
  sequelize: Sequelize,
  DataTypes: any,
  defineModel: DefineModelFunction,
  db: { [key: string]: any }
): void => {
  const model = defineModel(sequelize, DataTypes);
  db[model.name] = model;
  console.log(`New model added: ${model.name}`);
};

addModelToDb(sequelize, DataTypes, defineMeasurement, db);
addModelToDb(sequelize, DataTypes, defineMeasurementType, db);
addModelToDb(sequelize, DataTypes, defineSensorModel, db);
addModelToDb(sequelize, DataTypes, defineSensorDataModel, db);
addModelToDb(sequelize, DataTypes, defineSessionDataModel, db);
addModelToDb(sequelize, DataTypes, defineUserModel, db);
addModelToDb(sequelize, DataTypes, defineUserMeasurementTypeRequestModel, db);
addModelToDb(sequelize, DataTypes, defineUserSensorAccessModel, db);
addModelToDb(sequelize, DataTypes, defineUserSensorRequestModel, db);

// run `.associate` if applicable
Object.keys(db).map((model) => {
  if (db[model].associate) {
    db[model].associate(db);
  }
});

// attach both our instance and Sequelize to our db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
