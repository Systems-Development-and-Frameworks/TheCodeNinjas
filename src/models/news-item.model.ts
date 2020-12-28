export interface NewsItemProperties {
  id: number;
  title: string;
  votes: number;
  author: any;
}

export class NewsItemModel {
  id: number;
  title: string;
  votes: number;
  author: any;

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
