import type { Router } from "express";
import { check } from "express-validator";
import { JokesController } from "../../../adapters/input/express/JokesController";
import { JokesService } from "../../../../application/JokesService";
import { MssqlJokeRepository } from "../../../adapters/output/persistence/MssqlJokeRepository";
import { ChuckNorrisJokeProvider } from "../../../adapters/output/http/ChuckNorrisJokeProvider";
import { DadJokeProvider } from "../../../adapters/output/http/DadJokeProvider";
import { validateRequest } from "../middlewares/ValidateRequest";

const PROVIDER_ENUM = ["chuck", "dad"] as const;
type JokeProviderParam = (typeof PROVIDER_ENUM)[number];

export const registerJokesRoutes = (router: Router): void => {
  const repository = new MssqlJokeRepository();
  const chuckProvider = new ChuckNorrisJokeProvider();
  const dadProvider = new DadJokeProvider();
  const service = new JokesService(repository, chuckProvider, dadProvider);
  const controller = new JokesController(service);

  router.get("/jokes", controller.getRandomJoke);
  router.get("/jokes/paired", controller.getPairedJokes);
  router.get(
    "/jokes/:provider",
    [
      check("provider")
        .isString()
        .trim()
        .toLowerCase()
        .isIn(PROVIDER_ENUM)
        .withMessage("provider must be chuck or dad")
        .customSanitizer((value: string) => value as JokeProviderParam),
    ],
    validateRequest,
    controller.getRandomJoke
  );
  router.post(
    "/jokes",
    [check("text").isString().trim().notEmpty()],
    validateRequest,
    controller.createJoke
  );
  router.put(
    "/jokes/:number",
    [
      check("number").isInt({ gt: 0 }).toInt(),
      check("text").isString().trim().notEmpty(),
    ],
    validateRequest,
    controller.updateJoke
  );
  router.delete(
    "/jokes/:number",
    [check("number").isInt({ gt: 0 }).toInt()],
    validateRequest,
    controller.deleteJoke
  );
};
