import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import multer from "multer";
import morgan from "morgan";

import { db } from "./api/v1/db";
import config from "./config";
import routeV1 from "./api/v1/routes/v1";

import { swaggerDoc } from "./api/v1/utils/swagger";
import swaggerUi from "swagger-ui-express";
const app = express();

const apiPrefix = "/api/v1";

db.initialize()
  .then(() => {
    console.log("Database initialized");
  })
  .catch((err: any) => {
    console.log("Error initializing database", err);
  });

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
app.use(multer().any());
app.use(morgan("tiny"));

app.use(express.static("public"));

//app.use(apiPrefix, routeV1);

import { RegisterRoutes } from "../dist/routes";
RegisterRoutes(app);
app.use("/docs", swaggerUi.serve, async (_req: Request, res: Response) => {
  //ignore import error, it works
  return res.send(swaggerUi.generateHTML(await import("../dist/swagger.json")));
});
app.get("/swagger.json", async (_req: Request, res: Response) => {
  return res.send(await import("../dist/swagger.json"));
});
app.listen(config.port, () => {
  console.log("Server is running on port " + config.port);
  //swaggerDoc(app);
});
