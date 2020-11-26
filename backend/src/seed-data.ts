import * as uuid from "uuid";

export const posts = [
  {
    id: uuid.v4(),
    title: "Ein Toller Title",
    voters: [],
    userName: "Christoph Stach",
  },
  {
    id: uuid.v4(),
    title: "Phillips Post",
    voters: [],
    userName: "Phillip",
  },
  {
    id: uuid.v4(),
    title: "Flos Post",
    voters: [],
    userName: "Florian",
  },
  {
    id: uuid.v4(),
    title: "Noch ein Post",
    voters: [],
    userName: "Florian",
  },
];

export const users = [
  {
    name: "Christoph Stach",
  },
  {
    name: "Phillip",
  },
  {
    name: "Florian",
  },
];
