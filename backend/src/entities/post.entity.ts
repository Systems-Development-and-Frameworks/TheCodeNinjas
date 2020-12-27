import Person from "./person.entity";

export default class Post {
  id: string;
  title: string;
  voters: string[];
  author: Partial<Person>;
}
