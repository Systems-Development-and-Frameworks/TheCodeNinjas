import User from './user.entity';

export default class Post {
    id: string;

    title: string;

    votes: number;

    author?: User;
}
