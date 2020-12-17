import Post from "./entities/post.entity";
import Person from "./entities/person.entity";

export const posts: Post[] = [
  {
    id: "7ed8828b-f4de-4359-8160-1df1ff3234cd",
    title: "Ein Toller Title",
    author: "16787679-8a07-4742-8d60-97e72bbc8049",
    voters: [],
  },
  {
    id: "bea730b9-1585-4de2-9524-84fde899da7c",
    title: "Phillips Post",
    author: "16787679-8a07-4742-8d60-97e72bbc8049",
    voters: [],
  },
  {
    id: "b0684837-5261-4f63-81bb-432f4ea409bc",
    title: "Flos Post",
    author: "c140c845-ab82-425d-ab5b-6d4d80955cb0",
    voters: [],
  },
  {
    id: "10af216d-59bb-4cc1-9a27-246f22c2bee6",
    title: "Noch ein Post",
    author: "c140c845-ab82-425d-ab5b-6d4d80955cb0",
    voters: [],
  },
];

export const persons: Person[] = [
  {
    id: "58334916-ae55-4149-add5-0bc11f1b43c6",
    name: "Christoph Stach",
    email: "s0555912@htw-berlin.de",
    passwordHash:
      "$2b$10$jn8BT0wp60EIhtC08TCbfeJHkSw3unn7vN0Nogv7g7G.ufWXu0ucG", // chrisPW
    passwordSalt: "$2b$10$jn8BT0wp60EIhtC08TCbfe",
  },
  {
    id: "16787679-8a07-4742-8d60-97e72bbc8049",
    name: "Phillip",
    email: "s0557917@htw-berlin.de",
    passwordHash:
      "$2b$10$tLffjFzj1XV1nEm2ej.kDOWCtBRL5BZN8dm.93pkB/URmpvNWfGXq", // omaIstToll
    passwordSalt: "$2b$10$tLffjFzj1XV1nEm2ej.kDO",
  },
  {
    id: "c140c845-ab82-425d-ab5b-6d4d80955cb0",
    name: "Florian",
    email: "s0558101@htw-berlin.de",
    passwordHash:
      "$2b$10$hVlL24kwzK7s0Wx4CfpPaOqHeV7H2hfO7r5/Nh2ciOzJ2RL/Q.6ra", // flosPW
    passwordSalt: "$2b$10$hVlL24kwzK7s0Wx4CfpPaO",
  },
];
