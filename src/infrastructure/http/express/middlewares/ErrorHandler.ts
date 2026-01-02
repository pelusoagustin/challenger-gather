import type { NextFunction, Request, Response } from "express";
import Logger from "../../../config/Logger";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  Logger.error("Unhandled error", err);

  res.status(500).json({
    error: "Internal Server Error",
  });
};
