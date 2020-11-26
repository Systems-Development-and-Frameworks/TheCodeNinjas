import PostDatasource from "./datasources/post.datasource";
import UserDatasource from "./datasources/user.datasource";

const createDatasources = {
  postDatasource: new PostDatasource(),
  userDatasource: new UserDatasource(),
};

export default function () {
  return createDatasources;
}
