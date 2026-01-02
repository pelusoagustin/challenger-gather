import type { AuthClaims } from "./IAuthService";

export interface IJwtSigner {
  sign(claims: AuthClaims): string;
  verify(token: string): AuthClaims;
}
