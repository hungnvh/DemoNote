import {Component, Input} from '@angular/core';
import { NavController } from 'ionic-angular';
// import {Headers, Http} from "@angular/http";
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {TodoList} from "../todo-list/todo-list";
import {User} from "../../model/user";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  @Input('username') username: string = "";
  @Input('password') password: string = "";
  headersData = new HttpHeaders();

  constructor(public navCtrl: NavController,
              private http: HttpClient,
              public loadingCtrl: LoadingController,
              private storage: Storage) {
    this.headersData.append("Accept", 'application/json');
    this.headersData.append('Content-Type', 'application/json' );
    // this.autoLogin();
  }

  autoLogin() {
    this.storage.get('currentUser').then((val) => {
      if(val) {
        this.navCtrl.push(TodoList, {user: val, isTodoList: true});
      }
    });
  }

  signUp() {
    if (!this.username || !this.password) {
      return
    }
    let postData = {
      "email": this.username,
      "password": this.password
    }

    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.http.post("https://api.todo.ql6625.fr/api/Accounts", postData, {headers: this.headersData})
      .subscribe(data => {
        console.log(data);
        loading.dismiss();
      }, error => {
        console.log(error);
        loading.dismiss();
      });
  }

  signIn() {
    // if (!this.username || !this.password) {
    //   return
    // }
    let postData = {
      "username": this.username,
      "password": this.password
      // "email": "admin",
      // "password": "test"
    };
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();
    this.http.post("https://api.todo.ql6625.fr/api/Accounts/login", postData, {headers: this.headersData})
      .subscribe(data => {
        loading.dismiss();
        let user: User = data as User;
        this.storage.set('accesstoken', user.id);
        this.storage.set('currentUser', user);
        this.navCtrl.push(TodoList, {user: user, isTodoList: true});
      }, error => {
        loading.dismiss();
        console.log(error);
        this.storage.clear();
      });
  }
}
