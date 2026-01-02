import type { IExternalJokeProvider } from "../../../../application/ports/IExternalJokeProvider";
import { getJson } from "./HttpJsonClient";

type ChuckResponse = {
  value: string;
};

const getChuckUrl = (): string => {
  const url = process.env.CHUCK_API_URL;
  if (!url) {
    throw new Error("CHUCK_API_URL is not set");
  }
  return url;
};

export class ChuckNorrisJokeProvider implements IExternalJokeProvider {
  async getRandomJoke(): Promise<string> {
    const data = await getJson<ChuckResponse>(getChuckUrl());
    return data.value;
  }
}
