import type { NextFunction, Request, Response } from "express";
import type {
  AuthClaims,
  IAuthService,
} from "../../../../application/ports/IAuthService";
import { Role } from "../../../../domain/Role";

export type AuthenticatedRequest = Request & {
  user?: AuthClaims;
};

export const authenticateJwt =
  (authService: IAuthService) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization ?? "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const claims = authService.verifyToken(token);
      const hasName = typeof claims.name === "string" && claims.name.length > 0;
      const hasEmail =
        typeof claims.email === "string" && claims.email.length > 0;
      const hasRole = typeof claims.role === "string" && claims.role.length > 0;
      const hasIat = typeof (claims as { iat?: number }).iat === "number";
      const hasExp = typeof (claims as { exp?: number }).exp === "number";

      if (!hasName || !hasEmail || !hasRole || !hasIat || !hasExp) {
        res.status(401).json({ error: "Invalid token claims" });
        return;
      }

      req.user = claims;
      next();
    } catch {
      res.status(401).json({ error: "Invalid token" });
    }
  };

export const requireRole =
  (role: Role) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role ?? "";
    if (userRole !== role) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  };
