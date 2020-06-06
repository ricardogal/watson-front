import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from 'src/app/_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    url = 'http://localhost:3000';
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(this.url+"/user");
    }

    getById(id: number) {
        return this.http.get(`${this.url}/user/${id}`);
    }

    register(user: User) {
        return this.http.post(`${this.url}/login`, user);
    }

    update(user: User) {
        return this.http.put(`${this.url}/user/${user.id}`, user);
    }

    delete(id: number) {
        return this.http.delete(`${this.url}/user/${id}`);
    }
}
