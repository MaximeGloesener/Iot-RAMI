import { get } from "@docs/sensor/get";
import { create } from "@docs/sensor/create";
import { update } from "@docs/sensor/update";
import { deleteSensor } from "@docs/sensor/delete";

const paths = {
  "/sensors": {
    ...get,
    ...create,
    ...update,
    ...deleteSensor,
  },
};

export { paths as sensorPaths };
