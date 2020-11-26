import Post from "./post.entity";

export default class User {
  name: string;

  posts?: Post[];
}
