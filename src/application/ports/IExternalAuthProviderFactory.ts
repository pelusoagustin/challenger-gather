import type { IExternalAuthProvider } from "./IExternalAuthProvider";

export type ExternalProviderName = "google";

export interface IExternalAuthProviderFactory {
  getProvider(name: ExternalProviderName): IExternalAuthProvider | null;
}
