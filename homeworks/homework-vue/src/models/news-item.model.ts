export interface NewsItemProperties {
  id: number;
  title: string;
  votes: number;
}

export class NewsItemModel {
  id: number;
  title: string;
  votes: number;

  constructor({ id, title, votes = 0 }: NewsItemProperties) {
    this.id = id;
    this.title = title;
    this.votes = votes;
  }

  compareTo(other: NewsItemModel) : number {
    return other.votes - this.votes
  }
}
