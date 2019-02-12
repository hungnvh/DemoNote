import { Component } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';
import {Todo} from "../../model/todo";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';

import {User} from "../../model/user";

@Component({
  selector: 'todo-list',
  templateUrl: 'todo-list.html'
})
export class TodoList {

  todos: Todo[] = [];
  user: User;
  todoSelected: Todo;
  isTodoList: boolean;
  loading: any;
  headersData = new HttpHeaders();
  callback: any;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              private navParams: NavParams,
              private http: HttpClient,
              private storage: Storage,
              public loadingCtrl: LoadingController,) {
    // this.user = navParams.get('user');
    this.callback = this.navParams.get('callback');
    this.todoSelected = navParams.get('todoSelected');
    this.isTodoList = navParams.get('isTodoList');
    this.headersData.append("Accept", 'application/json');
    this.headersData.append('Content-Type', 'application/json' );
  }

  ngAfterContentInit() {
    if(this.isTodoList) {
      this.loadTodos();
    } else {
      this.loadNotes();
    }
  }

  loadNotes() {
    if(!this.todoSelected) {
      return;
    }
    this.storage.get('currentUser').then((user) => {
      let urlString = "https://api.todo.ql6625.fr/api/Todos/" + this.todoSelected.id + "/notes?access_token=" + user.id;
      this.showLoading();
      this.http.get(urlString,{headers: this.headersData})
        .subscribe(data => {
          this.todos = data as Todo[];
          console.log("loadNotes", this.todos);
          this.loading.dismiss();
        }, error => {
          console.log(error);
          this.loading.dismiss();
        });
    });
  };

  addNoteOfTodo() {
    const alert = this.alertCtrl.create({
      title: 'New Note',
      message: 'Entern the note s content',
      inputs: [
        {
          name: 'noteName',
          placeholder: 'Enter the content'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.requestAddNote(data.noteName);
          }
        }
      ]
    });
    alert.present();
  }

  requestAddNote(text) {
    if(!text) {
      return
    }
    this.showLoading();
    this.storage.get('currentUser').then((user) => {
      let urlString = "https://api.todo.ql6625.fr/api/Todos/" + this.todoSelected.id + "/notes?access_token=" + user.id;
      this.http.post(urlString, {text: text, todoId: this.todoSelected.id}, {headers: this.headersData})
        .subscribe(data => {
          let todo: Todo = data as Todo;
          this.todos.push(todo);
          this.loading.dismiss();
        }, error => {
          console.log(error);
          this.loading.dismiss();
        });
    });
  }

  loadTodos() {
    this.storage.get('currentUser').then((user) => {
      let urlString = "https://api.todo.ql6625.fr/api/Accounts/" + user.userId + "/todos?access_token=" + user.id;
      this.showLoading();
      this.http.get(urlString,{headers: this.headersData})
        .subscribe(data => {
          this.todos = data as Todo[];
          console.log("loadTodos", this.todos);
          this.loading.dismiss();
        }, error => {
          console.log(error);
          this.loading.dismiss();
        });
    });
  };

  addTodo() {
    const alert = this.alertCtrl.create({
      title: 'New Todo',
      inputs: [
        {
          name: 'noteName',
          placeholder: 'Enter the todo name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Add',
          handler: data => {
            this.requestAddTodoOrReplace(data.noteName, true);
          }
        }
      ]
    });
    alert.present();
  }

  requestAddTodoOrReplace(text, isAdd) {
    if(!text) {
      return
    }
    this.showLoading();
    this.storage.get('currentUser').then((user) => {
      const urlString = "https://api.todo.ql6625.fr/api/Todos/replaceOrCreate?access_token=" + user.id;
      const title = isAdd ? text : this.todoSelected.title;
      const complete = isAdd ? false : this.todoSelected.complete;
      const bodyData = {title: title, accountId: user.userId, complete: complete};
      this.http.post(urlString, bodyData, {headers: this.headersData})
        .subscribe(data => {
          if(isAdd) {
            let todo: Todo = data as Todo;
            this.todos.push(todo);
          } else {
            this.navCtrl.pop();
          }
          this.loading.dismiss();
        }, error => {
          console.log(error);
          this.loading.dismiss();
        });
    });
  }

  editNote(todo){
    this.navCtrl.push(TodoList, {todoSelected: todo, isTodoList: false, callback: this.reloadData});
  }

  reloadData = () => {
    this.loadTodos();
  };

  comfirDelete(todo) {
    const alert = this.alertCtrl.create({
      title: 'Confirmation',
      message: 'Are you sure delete this item?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: data => {
            this.deleteNote(todo);
          }
        }
      ]
    });
    alert.present();
  }

  deleteNote(todo){
    this.storage.get('currentUser').then((user) => {
      let urlString = "https://api.todo.ql6625.fr/api/Todos/" + todo.id + "?access_token=" + user.id;
      this.showLoading();
      this.http.delete(urlString , {headers: this.headersData})
        .subscribe(data => {
          this.todos = this.todos.filter( e => e.id != todo.id);
          this.loading.dismiss();
        }, error => {
          console.log(error);
          this.loading.dismiss();
        });
    });
  }

  checkDone() {
    this.todoSelected.complete = !this.todoSelected.complete;
    this.requestAddTodoOrReplace(this.todoSelected.title, false);
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }
}
