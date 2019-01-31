import { Component } from '@angular/core';
import { NavController, AlertController, NavParams } from 'ionic-angular';
import {Todo} from "../../model/todo";
import {Http} from "@angular/http";

@Component({
  selector: 'todo-list',
  templateUrl: 'todo-list.html'
})
export class TodoList {

  nodes: Todo[] = [];
  user: any;
  note: any;
  isTodoList: boolean;
  isCheckDone: boolean;

  items = [
    {title: 'hi1', description: 'test1'},
    {title: 'hi2', description: 'test2'},
    {title: 'hi3', description: 'test3'}
  ];
  headersData = new Headers();

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              private navParams: NavParams,
              private http: Http) {
    this.user = navParams.get('user');
    this.note = navParams.get('note');
    this.isTodoList = navParams.get('isTodoList');
    this.headersData.append("Accept", 'application/json');
    this.headersData.append('Content-Type', 'application/json' );
  }

  ngAfterContentInit() {
    this.loadNode();
  }

  loadNode() {

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
            this.requestAddTodo(data.noteName);
          }
        }
      ]
    });
    alert.present();
  }

  requestAddTodo(text) {
    if(!text) {
      return
    }

    this.http.post("https://api.todo.ql6625.fr/api/Accounts/" + this.user.userId + "/todos", {text: text}, {headers: this.headersData})
      .subscribe(data => {
        console.log("requestAddTodo", data);
      }, error => {
        console.log(error);
      });
  }

  editNote(note){
    this.navCtrl.push(TodoList, {note: note, isTodoList: false});
  }

  deleteNote(note){

  }

  checkDone(note) {
    this.isCheckDone = !this.isCheckDone;
  }
}
