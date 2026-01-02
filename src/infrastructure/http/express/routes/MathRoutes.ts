import type { Router } from "express";
import { check } from "express-validator";
import { MathController } from "../../../adapters/input/express/MathController";
import { MathService } from "../../../../application/MathService";
import { validateRequest } from "../middlewares/ValidateRequest";

const isIntegerList = (value: unknown): boolean => {
  const values = Array.isArray(value) ? value : [value];
  const tokens = values.flatMap((item) =>
    String(item)
      .split(",")
      .map((token) => token.trim())
      .filter((token) => token.length > 0)
  );

  if (tokens.length === 0) {
    return false;
  }

  return tokens.every((token) => Number.isInteger(Number(token)));
};

export const registerMathRoutes = (router: Router): void => {
  const service = new MathService();
  const controller = new MathController(service);

  router.get(
    "/math/lcm",
    [check("numbers").custom(isIntegerList)],
    validateRequest,
    controller.getLcm
  );
  router.get(
    "/math/increment",
    [check("number").isInt().toInt()],
    validateRequest,
    controller.getIncrement
  );
};
