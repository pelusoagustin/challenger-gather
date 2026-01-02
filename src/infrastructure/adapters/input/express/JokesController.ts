import type { Request, Response } from "express";
import type { IJokesService } from "../../../../application/ports/IJokesService";
import Logger from "../../../config/Logger";

export class JokesController {
  constructor(private readonly jokesService: IJokesService) {}

  getRandomJoke = async (req: Request, res: Response): Promise<void> => {
    const provider = req.params.provider as "chuck" | "dad" | undefined;

    try {
      const joke = await this.jokesService.getRandomJoke(provider);
      res.json({ joke });
    } catch (error) {
      Logger.error("Failed to fetch external joke", error);
      res.status(502).json({ error: "Failed to fetch joke" });
    }
  };

  getPairedJokes = async (_req: Request, res: Response): Promise<void> => {
    Logger.info("GET /jokes/paired - fetching paired jokes");
    try {
      const pairs = await this.jokesService.getPairedJokes();
      res.json(pairs);
    } catch (error) {
      Logger.error("Failed to fetch paired jokes", error);
      res.status(502).json({ error: "Failed to fetch jokes" });
    }
  };

  createJoke = async (req: Request, res: Response): Promise<void> => {
    const text = (req.body.text as string).trim();
    const joke = await this.jokesService.createJoke(text);
    res.status(201).json(joke);
  };

  updateJoke = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.number);
    const text = (req.body.text as string).trim();
    const joke = await this.jokesService.updateJoke(id, text);
    if (!joke) {
      res.status(404).json({ error: "Joke not found" });
      return;
    }

    res.json(joke);
  };

  deleteJoke = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.number);
    const deleted = await this.jokesService.deleteJoke(id);
    if (!deleted) {
      res.status(404).json({ error: "Joke not found" });
      return;
    }

    res.status(204).send();
  };
}
