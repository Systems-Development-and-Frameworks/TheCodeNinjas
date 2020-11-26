import Post from "./post.entity";

export default class User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  posts?: Post[];
}
