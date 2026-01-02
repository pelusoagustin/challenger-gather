import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../../http/express/middlewares/AuthMiddleware";
import type { IAuthService } from "../../../../application/ports/IAuthService";
import { ExternalAuthError } from "../../../../application/errors/ExternalAuthError";

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  login = async (req: Request, res: Response): Promise<void> => {
    const token = await this.authService.login(
      req.body.username,
      req.body.password
    );
    if (!token) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    res.json(token);
  };

  externalCallback = async (req: Request, res: Response): Promise<void> => {
    const provider = req.query.provider as string;
    const code = req.query.code as string;
    const state = req.query.state as string | undefined;

    try {
      const token = await this.authService.externalLogin(provider, code, state);
      res.json(token);
    } catch (error) {
      if (error instanceof ExternalAuthError) {
        res.status(error.code === "INVALID_PROVIDER" ? 400 : 401).json({
          error:
            error.code === "INVALID_PROVIDER" ? "Invalid provider" : "Invalid code",
        });
        return;
      }
      res.status(500).json({ error: "Failed to generate token" });
    }
  };

  user = (req: AuthenticatedRequest, res: Response): void => {
    res.json({ user: req.user });
  };

  admin = (req: AuthenticatedRequest, res: Response): void => {
    res.json({ user: req.user });
  };
}
