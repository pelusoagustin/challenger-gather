import type { Role } from "./Role";




export class User {
  readonly id: number;
  readonly username: string;
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role: Role;

  constructor(params: {
    id: number;
    username: string;
    name: string;
    email: string;
    password: string;
    role: Role;
  }) {
    this.id = params.id;
    this.username = params.username;
    this.name = params.name;
    this.email = params.email;
    this.password = params.password;
    this.role = params.role;
  }
}
