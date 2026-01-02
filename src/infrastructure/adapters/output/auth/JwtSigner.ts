import jwt, { type SignOptions } from "jsonwebtoken";
import type { AuthClaims } from "../../../../application/ports/IAuthService";
import type { IJwtSigner } from "../../../../application/ports/IJwtSigner";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return secret;
};

const getJwtExpiresIn = (): SignOptions["expiresIn"] =>
  (process.env.JWT_EXPIRES_IN ?? "1h") as SignOptions["expiresIn"];

export class JwtSigner implements IJwtSigner {
  sign(claims: AuthClaims): string {
    return jwt.sign(claims, getJwtSecret(), {
      algorithm: "HS256",
      expiresIn: getJwtExpiresIn(),
    });
  }

  verify(token: string): AuthClaims {
    return jwt.verify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    }) as AuthClaims;
  }
}
