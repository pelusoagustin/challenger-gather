import type { Joke } from "../../domain/Joke";

export interface IJokeRepository {
  create(text: string): Promise<Joke>;
  update(id: number, text: string): Promise<Joke | null>;
  delete(id: number): Promise<boolean>;
}