import { sensorPaths } from "@docs/sensor";
import { measurementTypePaths } from "@docs/measurementType";
import { measurementPaths } from "@docs/measurement";
import { userPaths } from "@docs/user";

const paths = {
  paths: {
    ...sensorPaths,
    ...measurementTypePaths,
    ...measurementPaths,
    ...userPaths,
  },
};

export { paths };
