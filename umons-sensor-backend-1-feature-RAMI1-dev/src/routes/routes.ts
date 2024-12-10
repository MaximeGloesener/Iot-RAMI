import { sensorRoutes } from "@routes/sensor";
import { sessionRoutes } from "@routes/session";
import { measurementTypeRoutes } from "@routes/measurementType";
import { measurementRoutes } from "@routes/measurement";
import { mqttClientServorRoutes } from "@routes/mqttClientServor";
import { homeRoutes } from "@routes/home";
import { userRoutes } from "@routes/user";
import { authRoutes } from "@routes/auth";
import { testRoutes } from "@routes/testRoutes";

const routes = [
  { path: "/sensors", handler: sensorRoutes },
  { path: "/sessions", handler: sessionRoutes },
  { path: "/measurementTypes", handler: measurementTypeRoutes },
  { path: "/measurements", handler: measurementRoutes },
  { path: "/connexion", handler: mqttClientServorRoutes },
  {
    path: "/users",
    handler: userRoutes,
  },
  {
    path: "/auth",
    handler: authRoutes,
  },
  {
    path: "/tests",
    handler: testRoutes,
  },
  {
    path: "/",
    handler: homeRoutes,
  },
];

export { routes };
