import type { Router } from "express";
import { check } from "express-validator";
import { AlertController } from "../../../adapters/input/express/AlertController";
import { AlertService } from "../../../../application/AlertService";
import { NotificationFactory } from "../../../config/NotificationFactory";
import { validateRequest } from "../middlewares/ValidateRequest";

export const registerAlertRoutes = (router: Router): void => {
  const factory = new NotificationFactory();
  const notifier = factory.createNotifier();
  const service = new AlertService(notifier);
  const controller = new AlertController(service);

  router.post(
    "/alert",
    [
      check("recipient").isString().trim().notEmpty(),
      check("message").isString().trim().notEmpty(),
    ],
    validateRequest,
    controller.sendAlert
  );
};
