import type { User } from "../../domain/User";

export interface IUserRepository {
  findByCredentials(username: string, password: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  createExternalUser(name: string, email: string, role: string): Promise<User>;
}
