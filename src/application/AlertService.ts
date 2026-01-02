import type { INotifier } from "./ports/INotifier";

export class AlertService {
  constructor(private readonly notifier: INotifier) {}

  async sendAlert(recipient: string, message: string): Promise<void> {
    await this.notifier.send(recipient, message);
  }
}
