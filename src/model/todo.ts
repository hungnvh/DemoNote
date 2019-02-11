export class Todo {
  id: string;
  title: string;
  complete: boolean;
  accountId: string;

  constructor (json: any) {
    if(json.id) {
      this.id = json.id;
    }
    this.title = json.title;
    this.complete = json.complete;
    this.accountId = json.accountId;
  }
}
