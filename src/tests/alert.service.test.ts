import { AlertService } from "../application/AlertService";
import type { INotifier } from "../application/ports/INotifier";

jest.mock("../infrastructure/config/Logger", () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe("AlertService", () => {
  test("calls notifier with recipient and message", async () => {
    const notifier: INotifier = {
      send: jest.fn().mockResolvedValue(undefined),
    };
    const service = new AlertService(notifier);

    await service.sendAlert("user@example.com", "hello");

    expect(notifier.send).toHaveBeenCalledTimes(1);
    expect(notifier.send).toHaveBeenCalledWith("user@example.com", "hello");
  });
});
