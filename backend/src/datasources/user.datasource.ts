import User from '../entities/user.entity';
import { DataSource } from 'apollo-datasource';
import { users } from '../seed-data' 

export default class UserDatasource extends DataSource{
    private users: User[];

    constructor() {
        super();

        this.users = users;
    }

    async getUsers() {
        return Promise.resolve(this.users);
    }

    async getUser(name: string) {
        return Promise.resolve(this.users.find(user => user.name == name));
    }

    async createUser(user: User) {
    }

    async updateUser(name: string, user: User) {
    }

    async deleteUser(name: string) {

    }


}
