import type { Router } from "express";
import { registerAuthRoutes } from "./AuthRoutes";
import { registerAlertRoutes } from "./AlertRoutes";
import { registerJokesRoutes } from "./JokesRoutes";
import { registerMathRoutes } from "./MathRoutes";

export const registerRoutes = (router: Router): void => {
  registerAuthRoutes(router);
  registerAlertRoutes(router);
  registerJokesRoutes(router);
  registerMathRoutes(router);
};
