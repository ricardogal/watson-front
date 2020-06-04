import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Watson } from 'src/app/_models/watson';

@Injectable({ providedIn: 'root' })
export class WatsonService {
    url = 'http://localhost:3000';
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Watson[]>(this.url+"/watson");
    }

    getById(id: number) {
        return this.http.get(`${this.url}/watson/${id}`);
    }

    update(watson: Watson) {
        return this.http.put(`${this.url}/watson/${watson.id}`, watson);
    }

    delete(id: number) {
        return this.http.delete(`${this.url}/watson/${id}`);
    }

    sendMessage(data) {
      return this.http.post(this.url+"/watson", data);
  }
}
