import { loadSchema } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { join } from "path";
import { addMocksToSchema } from "@graphql-tools/mock";
import { GraphQLSchema } from "graphql";

export async function executor({ document, variables }) {
  return Promise.resolve();
}

export default async function createGraphCmsSchema(): Promise<GraphQLSchema> {
  const schema = await loadSchema(join(__dirname, "schema.gql"), {
    loaders: [new GraphQLFileLoader()],
  });

  return Promise.resolve(addMocksToSchema({ schema }));
}
