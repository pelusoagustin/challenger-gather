export interface IExternalJokeProvider {
  getRandomJoke(): Promise<string>;
}