import type { Router } from "express";
import { check } from "express-validator";
import { AuthController } from "../../../adapters/input/express/AuthController";
import { AuthService } from "../../../../application/AuthService";
import { ExternalAuthProviderFactory } from "../../../adapters/output/auth/ExternalAuthProviderFactory";
import { JwtSigner } from "../../../adapters/output/auth/JwtSigner";
import { authenticateJwt, requireRole } from "../middlewares/AuthMiddleware";
import { validateRequest } from "../middlewares/ValidateRequest";
import { InMemoryUserRepository } from "../../../adapters/output/persistence/InMemoryUserRepository";

export const registerAuthRoutes = (router: Router): void => {
  const userRepository = new InMemoryUserRepository();
  const jwtSigner = new JwtSigner();
  const providerFactory = new ExternalAuthProviderFactory();
  const service = new AuthService(userRepository, jwtSigner, providerFactory);
  const controller = new AuthController(service);
  const requireJwt = authenticateJwt(service);

  router.post(
    "/auth/login",
    [
      check("username", ["body"]).isString().trim().notEmpty(),
      check("password", ["body"]).isString().notEmpty(),
    ],
    validateRequest,
    controller.login
  );

  router.get(
    "/auth/external/callback",
    [
      check("provider").isString().trim().notEmpty(),
      check("code").isString().trim().notEmpty(),
      check("state").optional().isString().trim(),
    ],
    validateRequest,
    controller.externalCallback
  );

  router.get("/user", requireJwt, requireRole("user"), controller.user);
  router.get("/admin", requireJwt, requireRole("admin"), controller.admin);
};
