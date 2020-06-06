import { NgModule } from  '@angular/core';
import { CommonModule } from  '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { User, Ticket } from 'src/app/_models';
import { UserService, AuthenticationService, TicketService, WatsonService  } from 'src/app/_services';



@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit, OnDestroy {
    currentUser: User;
    currentUserSubscription: Subscription;
    users: User[] = [];
    messages = [];
    messageToSend="";
    message={};
    id=0;
    session = "";
    tickets=[]




    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private ticketService: TicketService,
        private watsonService: WatsonService,
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
        this.messages = [
          // { id: 1, msg: 'Hi, how are you samim?', name:'',thumb:'assets/images/_D.jpg', 'date': '01/06/2020', hour:'10:10',order:'start' },
          // { id: 2, msg: 'ola, como vai vc ?', name:'',thumb:'assets/images/homem.jpeg', 'date': '01/06/2020', hour:'10:12',order:'end' },
        ];
        this.tickets = [];
    }

    ngOnInit() {
        this.loadAllUsers();
        this.callWatson("")
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }


    deleteUser(id: number) {
        this.userService.delete(id).pipe(first()).subscribe(() => {
            this.loadAllUsers()
        });
    };

    getMessageToSend() {
        return this.messageToSend;
    }

    setMessageToSend(msg) {
        this.messageToSend = msg;
    };

    appendMessages(msg, order='start') {
      let date = new Date();
      let hourNow = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
      let item = { id: this.id, msg: msg, name:this.currentUser.name,thumb:'assets/images/homem.jpeg', hour:hourNow,order:'end' };
      this.messages.push(item);
    };

    private loadAllUsers() {
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.users = users;
        });
    }

    private sendMessage(msg){
      this.appendMessages(this.messageToSend,'end');
      this.callWatson(this.messageToSend);
      this.messageToSend=""
    }

    private callWatson(msg){
      let formData = {
        'message': msg,
        'idUser': this.currentUser.id,
        'session_id': this.session != "" ? this.session : ""
      }
      if(this.session != "") formData['session_id'] = this.session
      var result = "";

      this.watsonService.sendMessage(formData).pipe(first()).subscribe((watsons:any) => {
        let dateObjs = new Date();
        let dateNow  = dateObjs.getDate()+"/"+dateObjs.getMonth()+"/"+dateObjs.getFullYear();
        let hourNow = dateObjs.getHours()+":"+dateObjs.getMinutes();
        this.session = watsons.session_id;
        if(watsons){
          let item = { id: this.id, msg: watsons.result.output.generic[0].text, name:this.currentUser.name,thumb:'assets/images/_D.jpg', 'date': dateNow, hour:hourNow,order:'start' };
          console.log(item);
          this.messages.push(item);
          console.log(watsons);
          if(watsons.data.length > 0){
            this.tickets = watsons.data;
            let html = "<div class='msg'>";

            for(let value of watsons.data){
                html += "<label>ID: </label>"+value.id+"<br />";
                html += "<label>Título: </label>"+value.title+"<br />";
                html += "<label>Descrição: </label>"+value.description+"<br /><br />";
            }
            html += "</div>";
            let item = { id: this.id, msg: html, name:this.currentUser.name,thumb:'assets/images/_D.jpg', 'date': dateNow, hour:hourNow,order:'start' };
            this.messages.push(item);
          }
        }
      });
    }
}
