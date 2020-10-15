export class NewsItemModel {
  id: number;
  title: string;
  votes: number;

  constructor({
    id,
    title,
    votes = 0
  }: {
    id: number;
    title: string;
    votes: number;
  }) {
    this.id = id;
    this.title = title;
    this.votes = votes;
  }
}
