import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/ErrorHandler";
import { registerRoutes } from "./routes";

export const createApp = (): express.Express => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const apiRouter = express.Router();
  registerRoutes(apiRouter);
  app.use("/api", apiRouter);

  app.use(errorHandler);

  return app;
};
