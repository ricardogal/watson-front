import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from 'src/app/_models';
import {Environment} from "src/app/decorators/environment.decorator";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    apiUrl =  'http://localhost:3000';

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(register: string, password: string) {
      console.log(register);
      console.log(password);
      let log = {
        "register": register,
        "password": password
      }
      return this.http.post<any>(`${this.apiUrl}/login`, log)
          .pipe(
            map(response => {
              let newUser = response.data;
              console.log(newUser);
              if (newUser.length > 0) {
                  // store user details and jwt token in local storage to keep user logged in between page refreshes
                  localStorage.setItem('currentUser', JSON.stringify(newUser[0]));
                  this.currentUserSubject.next(newUser[0]);
              }
              console.log(newUser[0]);
              return newUser[0];
            })
          );
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
