import type { IExternalJokeProvider } from "../../../../application/ports/IExternalJokeProvider";
import { getJson } from "./HttpJsonClient";

type DadResponse = {
  joke: string;
};

const getDadUrl = (): string => {
  const url = process.env.DAD_API_URL;
  if (!url) {
    throw new Error("DAD_API_URL is not set");
  }
  return url;
};

export class DadJokeProvider implements IExternalJokeProvider {
  async getRandomJoke(): Promise<string> {
    const data = await getJson<DadResponse>(getDadUrl(), {
      "User-Agent": "challenger-jokes-api",
    });
    return data.joke;
  }
}
