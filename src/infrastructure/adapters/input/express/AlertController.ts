import type { Request, Response } from "express";
import { AlertService } from "../../../../application/AlertService";

export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  sendAlert = async (req: Request, res: Response): Promise<void> => {
    const recipient = req.body.recipient as string;
    const message = req.body.message as string;

    await this.alertService.sendAlert(recipient, message);
    res.status(202).json({ status: "sent" });
  };
}
