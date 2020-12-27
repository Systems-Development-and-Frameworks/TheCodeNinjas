// TODO: check if its OK to change the return type from Post to Integer for up and downvote.
// This is easier to handle as we are not using an executor instead of delegate schema.

const typeDefs = `
  extend type Post {
      votes: Int
  }
  
  type Mutation {
      write(title: String!): ID
      delete(id: ID!): ID
  
      upvote(id: ID!): Int
      downvote(id: ID!): Int
  
      login(email: String!, password: String!): String
      signup(name: String!, email: String!, password: String!): String
  }
`;

export default typeDefs;
