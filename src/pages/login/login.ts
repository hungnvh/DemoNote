import {Component, Input} from '@angular/core';
import { NavController } from 'ionic-angular';
import {Headers, Http} from "@angular/http";
import {TodoList} from "../todo-list/todo-list";
import {User} from "../../model/user";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  @Input('username') username: string = "";
  @Input('password') password: string = "";
  headersData = new Headers();

  constructor(public navCtrl: NavController,
              private http: Http) {
    this.headersData.append("Accept", 'application/json');
    this.headersData.append('Content-Type', 'application/json' );
  }

  signUp() {
    if (!this.username || !this.password) {
      return
    }
    // "email": "customer001@email.com",
    //   "password": "123456789"
    let postData = {
      "email": this.username,
      "password": this.password
    }

    this.http.post("https://api.todo.ql6625.fr/api/Accounts", postData, {headers: this.headersData})
      .subscribe(data => {
        console.log(data);
      }, error => {
        console.log(error);
      });
  }

  signIn() {
    if (!this.username || !this.password) {
      return
    }
    let postData = {
      "email": this.username,
      "password": this.password
    };
    this.http.post("https://api.todo.ql6625.fr/api/Accounts/login", postData, {headers: this.headersData})
      .subscribe(data => {
        console.log(data);
        let user: User = data['_body'];
        this.navCtrl.push(TodoList, {user: user, isTodoList: true});
      }, error => {
        console.log(error);
      });
  }

}
