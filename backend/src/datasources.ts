import PostDatasource from './datasources/post.datasource';
import UserDatasource from './datasources/user.datasource';

const dataSources = {
  postDatasource: new PostDatasource(),
  userDatasource: new UserDatasource(),
};
export default dataSources;
