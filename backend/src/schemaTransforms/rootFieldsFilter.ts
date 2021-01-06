export const filter: RootFilter = (operation, fieldName, field) => {
  if(operation == 'Mutation'){
      // console.log("test1");
    return true;
  }


//   if (
//     fieldName == "upvote" ||
//     fieldName == "downvote" ||
//     fieldName == "write" ||
//     fieldName == "delete" ||
//     fieldName == "login" ||
//     fieldName == "signup"
//   ) {
//       console.log("test2");
//     return true;
//   }

  if (
    fieldName == "posts" ||
    fieldName == "post" ||
    fieldName == "persons" ||
    fieldName == "person"
  ) {
    return true;
  }

  return false;
};

export type RootFilter = (
  operation: "Query" | "Mutation" | "Subscription",
  fieldName: string,
  field: any
) => boolean;
