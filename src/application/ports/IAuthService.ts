export type AuthToken = {
  token: string;
};

import type { Role } from "../../domain/Role";

export type AuthClaims = {
  sub: string;
  name: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
};

export interface IAuthService {
  login(username: string, password: string): Promise<AuthToken | null>;
  verifyToken(token: string): AuthClaims;
  externalLogin(
    provider: string,
    code: string,
    state?: string
  ): Promise<AuthToken>;
}
