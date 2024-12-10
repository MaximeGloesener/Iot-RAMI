import "dotenv/config";
import express, { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { openApiDocumentation } from "@docs/index";

import { routes } from "@routes/routes";
import { NotFoundException } from "@utils/exceptions";

const app: Express = express();

app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 })
);

app.use(
  (
    _req: { method: string; url: string; body: any },
    res: { setHeader: (arg0: string, arg1: string) => void },
    next: () => void
  ) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
  }
);

const baseUri = "/api/v1";

for (const route of routes) {
  app.use(baseUri + route.path, route.handler);
}

app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

app.all("*", (_req, res) => {
  return res
    .status(404)
    .json(new NotFoundException("Resource not found", "resource.not.found"));
});

export default app;
