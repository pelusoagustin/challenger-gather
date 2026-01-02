import type {
  ExternalProviderName,
  IExternalAuthProviderFactory,
} from "../../../../application/ports/IExternalAuthProviderFactory";
import type { IExternalAuthProvider } from "../../../../application/ports/IExternalAuthProvider";
import { FakeGoogleAuthProvider } from "./FakeGoogleAuthProvider";

export class ExternalAuthProviderFactory implements IExternalAuthProviderFactory {
  private readonly provider: IExternalAuthProvider = new FakeGoogleAuthProvider();

  getProvider(name: ExternalProviderName): IExternalAuthProvider | null {
    if (name !== "google") {
      return null;
    }
    return this.provider;
  }
}
