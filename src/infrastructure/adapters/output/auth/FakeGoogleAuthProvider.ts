import type {
  ExternalProfile,
  IExternalAuthProvider,
} from "../../../../application/ports/IExternalAuthProvider";
import { ExternalAuthError } from "../../../../application/errors/ExternalAuthError";

const CODE_MAP: Record<string, ExternalProfile> = {
  "valid-google-code": { name: "Google User", email: "google@example.com" },
};

export class FakeGoogleAuthProvider implements IExternalAuthProvider {
  async exchangeCodeForProfile(code: string): Promise<ExternalProfile> {
    const profile = CODE_MAP[code];
    if (!profile) {
      throw new ExternalAuthError("INVALID_CODE");
    }
    return profile;
  }
}
