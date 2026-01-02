import type { IJokeRepository } from "./ports/IJokeRepository";
import type { IExternalJokeProvider } from "./ports/IExternalJokeProvider";
import type { IJokesService, JokeProvider } from "./ports/IJokesService";
import { Joke } from "../domain/Joke";

export class JokesService implements IJokesService {
  constructor(
    private readonly jokeRepository: IJokeRepository,
    private readonly chuckProvider: IExternalJokeProvider,
    private readonly dadProvider: IExternalJokeProvider
  ) {}

  async getRandomJoke(provider?: JokeProvider): Promise<string> {
    const selectedProvider = this.resolveProvider(provider);
    return selectedProvider.getRandomJoke();
  }

  async getPairedJokes(): Promise<
    { chuck: string; dad: string; combined: string }[]
  > {
    const chuckPromises = Array.from({ length: 5 }, () =>
      this.chuckProvider.getRandomJoke()
    );
    const dadPromises = Array.from({ length: 5 }, () =>
      this.dadProvider.getRandomJoke()
    );

    const [chuckJokes, dadJokes] = await Promise.all([
      Promise.all(chuckPromises),
      Promise.all(dadPromises),
    ]);

    return chuckJokes.map((chuck, index) => {
      const dad = dadJokes[index] ?? "";
      const combined = `${chuck} Also, ${dad}`;
      return { chuck, dad, combined };
    });
  }

  async createJoke(text: string): Promise<Joke> {
    return this.jokeRepository.create(text);
  }

  async updateJoke(id: number, text: string): Promise<Joke | null> {
    return this.jokeRepository.update(id, text);
  }

  async deleteJoke(id: number): Promise<boolean> {
    return this.jokeRepository.delete(id);
  }

  private resolveProvider(provider?: JokeProvider): IExternalJokeProvider {
    if (!provider) {
      return Math.random() < 0.5 ? this.chuckProvider : this.dadProvider;
    }
    if (provider === "chuck") {
      return this.chuckProvider;
    }
    if (provider === "dad") {
      return this.dadProvider;
    }
    throw new Error("INVALID_PROVIDER");
  }
}
