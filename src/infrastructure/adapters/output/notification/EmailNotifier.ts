import type { INotifier } from "../../../../application/ports/INotifier";
import Logger from "../../../config/Logger";

export class EmailNotifier implements INotifier {
  async send(recipient: string, message: string): Promise<void> {
    Logger.info(
      `[EmailNotifier] Sending email to ${recipient} with message: ${message}`
    );
  }
}
