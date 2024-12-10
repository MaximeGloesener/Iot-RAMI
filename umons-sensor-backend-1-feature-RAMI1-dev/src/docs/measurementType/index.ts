import { get } from "@docs/measurementType/get";
import { create } from "@docs/measurementType/create";
import { update } from "@docs/measurementType/update";
import { deleteMeasurementType } from "@docs/measurementType/delete";

const paths = {
  "/measurementTypes": {
    ...get,
    ...create,
    ...update,
    ...deleteMeasurementType,
  },
};

export { paths as measurementTypePaths };
