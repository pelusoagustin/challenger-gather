import type { IUserRepository } from "../../../../application/ports/IUserRepository";
import { Role } from "../../../../domain/Role";
import { User } from "../../../../domain/User";

const MOCK_USERS: User[] = [
  new User({
    id: 1,
    username: "manolito",
    name: "Manolito",
    email: "manolito@example.com",
    password: "secret123",
    role: "admin",
  }),
  new User({
    id: 2,
    username: "pepe",
    name: "Pepe",
    email: "pepe@example.com",
    password: "secret123",
    role: "user",
  }),
  new User({
    id: 3,
    username: "isabel",
    name: "Isabel",
    email: "isabel@example.com",
    password: "secret123",
    role: "user",
  }),
  new User({
    id: 4,
    username: "pedro",
    name: "Pedro",
    email: "pedro@example.com",
    password: "secret123",
    role: "user",
  }),
];

export class InMemoryUserRepository implements IUserRepository {
  async findByCredentials(
    username: string,
    password: string
  ): Promise<User | null> {
    const user = MOCK_USERS.find(
      (item) => item.username === username && item.password === password
    );
    return user ?? null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = MOCK_USERS.find((item) => item.username === username);
    return user ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = MOCK_USERS.find((item) => item.email === email);
    return user ?? null;
  }

  async createExternalUser(
    name: string,
    email: string,
    role: Role
  ): Promise<User> {
    const user = new User({
      id: MOCK_USERS.length + 1,
      username: email,
      name,
      email,
      password: "",
      role,
    });
    MOCK_USERS.push(user);
    return user;
  }
}
