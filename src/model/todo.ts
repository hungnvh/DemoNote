export class Todo {
  id: string;

  constructor (json: any) {
    if(json.id) {
      this.id = json.id;
    }
  }
}
