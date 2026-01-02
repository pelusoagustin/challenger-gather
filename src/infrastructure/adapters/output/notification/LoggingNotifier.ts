import type { INotifier } from "../../../../application/ports/INotifier";
import {
  addNotificationRecord,
  getNotificationHistory,
} from "./NotificationHistory";
import Logger from "../../../config/Logger";

export class LoggingNotifier implements INotifier {
  constructor(
    private readonly notifier: INotifier,
    private readonly channel: string
  ) {}

  async send(recipient: string, message: string): Promise<void> {
    const history = getNotificationHistory();
    Logger.info(
      `[LoggingNotifier] History size before send: ${history.length}`
    );

    await this.notifier.send(recipient, message);

    addNotificationRecord({
      recipient,
      message,
      channel: this.channel,
      timestamp: new Date().toISOString(),
    });
  }
}
