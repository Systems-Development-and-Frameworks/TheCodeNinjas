import { PersonProperties } from "@/models/person.model";

export interface NewsItemProperties {
  id: string;
  title: string;
  votes: number;
  author: PersonProperties | null;
}

export class NewsItemModel {
  id: string;
  title: string;
  votes: number;
  author: PersonProperties | null;

  constructor({ id, title, votes = 0, author = null }: NewsItemProperties) {
    this.id = id;
    this.title = title;
    this.votes = votes;
    this.author = author;
  }

  compareToDescending(other: NewsItemModel): number {
    return other.votes - this.votes;
  }

  compareToAscending(other: NewsItemModel): number {
    return this.votes - other.votes;
  }
}
