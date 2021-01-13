// TODO: check if its OK to change the return type from Post to Integer for up and downvote.
// This is easier to handle as we are not using an executor instead of delegate schema.

const typeDefs = `
  extend type Post {
      votes: Int
  }
  
  type Mutation {
      write(title: String!): Post
      delete(id: ID!): Post
  
      upvote(id: ID!): Post
      downvote(id: ID!): Post
  
      login(email: String!, password: String!): String
      signup(name: String!, email: String!, password: String!): String
  }
`;

export default typeDefs;
