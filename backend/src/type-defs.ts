import { readFileSync } from "fs";

const typeDefs = readFileSync("src/schema.graphql").toString();
export default typeDefs;
