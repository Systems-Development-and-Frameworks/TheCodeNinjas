import PostDatasource from "./datasources/post.datasource";
import UserDatasource from "./datasources/user.datasource";
import { users, posts } from "./seed-data";

const createDatasources = {
  postDatasource: new PostDatasource(posts),
  userDatasource: new UserDatasource(users),
};

export default function () {
  return createDatasources;
}
