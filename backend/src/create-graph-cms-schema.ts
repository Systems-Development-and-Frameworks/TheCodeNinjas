import { introspectSchema, wrapSchema } from "graphql-tools";
import { GraphQLSchema, print } from "graphql";
import {
  FilterRootFields,
  RenameTypes,
  TransformObjectFields,
  FilterObjectFields,
} from "@graphql-tools/wrap";

import { fetch } from "cross-fetch";
import { FieldTransformer } from "@graphql-tools/wrap/types";
import { RenameRootFields } from "apollo-server";
import { posts } from "./seed-data";

export async function executor({ document, variables }) {
  const query = print(document);
  const headers: HeadersInit = { "Content-Type": "application/json" };

  if (process.env.GRAPH_CMS_API_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GRAPH_CMS_API_TOKEN}`;
  }

  const fetchResult = await fetch(process.env.GRAPH_CMS_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  return fetchResult.json();
}

const filter: RootFilter = (operation, fieldName) => {
  console.log("-- ", operation);

  if(operation == 'Mutation'){
    return false;
  }

  if(fieldName == 'posts' || fieldName == 'post' || fieldName == 'persons' || fieldName == 'person'){
    return true;
  }
  
  return false;
};

export default async function createGraphCmsSchema(): Promise<GraphQLSchema> {
  return wrapSchema({
    schema: await introspectSchema(executor),
    executor,
    transforms: [
      new FilterRootFields(filter),
    ]
  });
}

type RootFilter = (
  operation: 'Query' | 'Mutation' | 'Subscription',
  fieldName: string,
) => boolean;
