import type { INotifier } from "../../../../application/ports/INotifier";
import Logger from "../../../config/Logger";

export class SmsNotifier implements INotifier {
  async send(recipient: string, message: string): Promise<void> {
    Logger.info(
      `[SmsNotifier] Sending SMS to ${recipient} with message: ${message}`
    );
  }
}
