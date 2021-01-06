import { GraphQLFieldConfig } from "graphql/type/definition";

export const filter: ObjectFilter = (typeName, fieldName, fieldConfig) => {
  
  // console.log("TypeName:", typeName.toString());
  // console.log("FieldName:", fieldName.toString());

  // if( typeName.match('Person') || typeName.match('Post') ){
  //   return true;
  // }
  
  // if (
  //   fieldName === 'post' ||
  //   fieldName === 'posts' ||
  //   fieldName === 'person' ||
  //   fieldName === 'persons' ||
  //   fieldName === "id" ||
  //   fieldName === "name" ||
  //   fieldName === "email" ||
  //   fieldName === "posts" ||
  //   fieldName === "votedPosts" ||
  //   fieldName === "title" ||
  //   fieldName === "author"
  // ) {
  //   return true;
  // }

  // if(fieldName === "passwordSalt"){
  //   console.log("PasswordSalt is false");
  //   return false;
  // }

  return true;
};


export type ObjectFilter = (
  typeName: string,
  fieldName: string,
  fieldConfig: GraphQLFieldConfig<any, any>,
) => boolean;
