import { UserInputError, AuthenticationError, gql } from "apollo-server";
import { GraphQLSchema } from "graphql";
import UserDatasource from "../datasources/user.datasource";
import { SigninDto } from "../dtos/signin.dto";
import { SignupDto } from "../dtos/signup.dto";
import { JwtPayload } from "../jwt-payload";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { delegateToSchema } from "@graphql-tools/delegate";


export function query(subSchemas: GraphQLSchema[]) {

  return {};
};

export function properties (subSchemas: GraphQLSchema[]) {

  return {};
};

export function mutation (subSchemas: GraphQLSchema[], executor: any) {

  const [graphCmsSchema] = subSchemas;
  
  return {

    signup: {
      resolve: async (_, args: SignupDto, context, info) => {
        const { name, email, password } = args;
  
        if (password.length < 8) {
          throw new UserInputError("Password must at least 8 characters long");
        }
  
        const passwordSalt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
        const passwordHash = await bcrypt.hash(password, passwordSalt);
               
        const mutation = gql`
        mutation($name: String!, $email: String!, $passwordHash: String!, $passwordSalt: String! ) {
          createPerson(
            data: { 
              name: $name, 
              email: $email, 
              passwordHash: $passwordHash,
              passwordSalt: $passwordSalt
            }
          ){
            id
          }
        }
        `
        const user = await executor({
          document: mutation, 
          variables: {
            name, 
            email, 
            passwordHash, 
            passwordSalt
          }
        });

        const payload: JwtPayload = { id: user.id };
  
        return jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
      }
    },

    login: {
      resolve: async (_, args: SigninDto, ctx) => {

        const query = gql`
        query($email: String!){
          person(where: {email: $email}){
            id,
            passwordHash,
            passwordSalt
          }
        }
        `
        const { email, password } = args;
        
        const user = await executor({
          document: query, 
          variables: {email}
        })

        if (!user) {
          throw new AuthenticationError("Wrong credentials");
        }
        const hash = await bcrypt.hash(password, user.data.person.passwordSalt);
    
        if (hash === user.data.person.passwordHash) {
          const payload: JwtPayload = { id: user.data.person.id };
    
          return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });
        } else {
          throw new AuthenticationError("Wrong credentials");
        }
      }
    }

  };
};