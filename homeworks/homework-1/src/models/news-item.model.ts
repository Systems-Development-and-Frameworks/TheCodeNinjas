export class NewsItemModel {
  id: number;
  title: string;
  votes: number;

  constructor(id: number, title: string, votes: number) {
    this.id = id;
    this.title = title;
    this.votes = votes;
  }
}
