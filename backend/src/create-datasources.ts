import PostDatasource from "./datasources/post.datasource";
import PersonDatasource from "./datasources/person.datasource";
import { persons, posts } from "./seed-data";

const createDatasources = {
  postDatasource: new PostDatasource(posts),
  personDatasource: new PersonDatasource(persons),
};

export default function () {
  return createDatasources;
}
