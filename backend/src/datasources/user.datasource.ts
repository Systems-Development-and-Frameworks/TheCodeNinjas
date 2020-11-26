import { DataSource } from "apollo-datasource";
import User from "../entities/user.entity";
import { users } from "../seed-data";

export default class UserDatasource extends DataSource {
  users: User[];

  constructor() {
    super();

    this.users = users;
  }

  getUsers(): Promise<User[]> {
    return Promise.resolve(this.users);
  }

  getUser(name: string): Promise<User> {
    return Promise.resolve(this.users.find((user) => user.name == name));
  }
}
