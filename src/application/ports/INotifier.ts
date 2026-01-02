export interface INotifier {
  send(recipient: string, message: string): Promise<void>;
}
