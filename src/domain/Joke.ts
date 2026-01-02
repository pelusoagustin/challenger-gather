export class Joke {
  readonly id: number;
  readonly text: string;

  constructor(params: { id: number; text: string }) {
    this.id = params.id;
    this.text = params.text;
  }
}