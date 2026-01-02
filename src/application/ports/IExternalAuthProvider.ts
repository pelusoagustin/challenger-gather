export type ExternalProfile = {
  name: string;
  email: string;
};

export interface IExternalAuthProvider {
  exchangeCodeForProfile(code: string, state?: string): Promise<ExternalProfile>;
}
