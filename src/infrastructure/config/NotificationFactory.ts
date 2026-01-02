import type { INotifier } from "../../application/ports/INotifier";
import { EmailNotifier } from "../adapters/output/notification/EmailNotifier";
import { SmsNotifier } from "../adapters/output/notification/SmsNotifier";
import { LoggingNotifier } from "../adapters/output/notification/LoggingNotifier";

export type NotificationChannel = "email" | "sms";

export class NotificationFactory {
  private notifier: INotifier | null = null;

  private getChannel(): NotificationChannel {
    const raw = (process.env.NOTIFICATION_CHANNEL ?? "email").toLowerCase();
    if (raw === "sms") {
      return "sms";
    }
    return "email";
  }

  createNotifier(): INotifier {
    if (this.notifier) {
      return this.notifier;
    }
    const channel = this.getChannel();
    const notifier = channel === "sms" ? new SmsNotifier() : new EmailNotifier();
    this.notifier = new LoggingNotifier(notifier, channel);
    return this.notifier;
  }
}
