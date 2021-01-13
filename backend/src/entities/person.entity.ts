import Post from "./post.entity";

export default class Person {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  posts?: Post[];
}
