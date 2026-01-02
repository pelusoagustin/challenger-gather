import { JokesService } from "../application/JokesService";
import type { IJokeRepository } from "../application/ports/IJokeRepository";
import type { IExternalJokeProvider } from "../application/ports/IExternalJokeProvider";

class FakeJokeRepository implements IJokeRepository {
  async create(): Promise<never> {
    throw new Error("Not implemented");
  }

  async update(): Promise<never> {
    throw new Error("Not implemented");
  }

  async delete(): Promise<never> {
    throw new Error("Not implemented");
  }
}

class SequencedProvider implements IExternalJokeProvider {
  private counter = 0;

  constructor(private readonly prefix: string) {}

  async getRandomJoke(): Promise<string> {
    this.counter += 1;
    return `${this.prefix}-${this.counter}`;
  }
}

describe("JokesService.getPairedJokes", () => {
  test("returns 5 paired jokes in order", async () => {
    const repo = new FakeJokeRepository();
    const chuck = new SequencedProvider("chuck");
    const dad = new SequencedProvider("dad");
    const service = new JokesService(repo, chuck, dad);

    const result = await service.getPairedJokes();

    expect(result).toHaveLength(5);
    for (let i = 0; i < 5; i += 1) {
      const index = i + 1;
      expect(result[i].chuck).toBe(`chuck-${index}`);
      expect(result[i].dad).toBe(`dad-${index}`);
      expect(result[i].combined).toEqual(
        expect.stringContaining(`chuck-${index}`)
      );
      expect(result[i].combined).toEqual(
        expect.stringContaining(`dad-${index}`)
      );
    }
  });
});
