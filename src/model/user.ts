export class User {
  id: string;
  userId: string;

  constructor (json: any) {
    if(json.id) {
      this.id = json.id;
    }
    if(json.userId) {
      this.userId = json.userId;
    }
  }
}
