import type { Joke } from "../../domain/Joke";

export type JokeProvider = "chuck" | "dad";

export interface IJokesService {
  getRandomJoke(provider?: JokeProvider): Promise<string>;
  getPairedJokes(): Promise<
    {
      chuck: string;
      dad: string;
      combined: string;
    }[]
  >;
  createJoke(text: string): Promise<Joke>;
  updateJoke(id: number, text: string): Promise<Joke | null>;
  deleteJoke(id: number): Promise<boolean>;
}
