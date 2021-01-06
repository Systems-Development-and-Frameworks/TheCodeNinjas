import { introspectSchema, wrapSchema } from "graphql-tools";
import { GraphQLSchema, print } from "graphql";
import { FilterObjectFields } from "@graphql-tools/wrap";

import { fetch } from "cross-fetch";

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

export default async function createGraphCmsSchema(): Promise<GraphQLSchema> {
  return wrapSchema({
    schema: await introspectSchema(executor),
    executor,
    transforms:[
      new FilterObjectFields((typeName, fieldName, fieldConfig) => {
        if(typeName == 'Person' && (fieldName == 'passwordHash' || fieldName == 'passwordSalt')){
          return false;
        }
        return true;
      })
    ],
  });
}
