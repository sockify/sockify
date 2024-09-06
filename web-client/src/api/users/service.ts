import axios from "axios";

import { User, usersSchema } from "./model";

export interface UserService {
  getUsers(): Promise<User[]>;
}

export class HttpUserService implements UserService {
  async getUsers(): Promise<User[]> {
    const { data } = await axios.get("/api/v1/users");
    return usersSchema.parse(data);
  }
}
