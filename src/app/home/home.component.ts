﻿import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
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
    watsonMessage = "";




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
    }

    ngOnInit() {
        this.loadAllUsers();
        this.callWatson("");
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

    private loadAllTickets() {
      /*this.ticketService.getAll().pipe(first()).subscribe(users => {
          this.users = users;
      });*/
    }

    private sendMessage(msg){
      this.appendMessages(msg,'end');
      this.callWatson(msg);
    }

    private callWatson(msg){
      let formData = {
        'message': msg
      }
      var result = "";
      this.watsonService.sendMessage(formData).pipe(first()).subscribe(watsons => {
        let dateObjs = new Date();
        let dateNow  = dateObjs.getDate()+"/"+dateObjs.getMonth()+"/"+dateObjs.getFullYear();
        let hourNow = dateObjs.getHours()+":"+dateObjs.getMinutes();
        //let item = { id: this.id, msg: watsons.response, name:this.currentUser.name,thumb:'assets/images/_D.jpg', 'date': dateNow, hour:hourNow,order:'start' };
        //this.messages.push(item);

      });
    }
}
