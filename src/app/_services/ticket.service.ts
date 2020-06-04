import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Ticket } from 'src/app/_models/ticket';

@Injectable({ providedIn: 'root' })
export class TicketService {
    url = 'http://localhost:3000';
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Ticket[]>(this.url+"/tickets");
    }

    getById(id: number) {
        return this.http.get(`${this.url}/tickets/${id}`);
    }

    update(ticket: Ticket) {
        return this.http.put(`${this.url}/tickets/${ticket.id}`, ticket);
    }

    delete(id: number) {
        return this.http.delete(`${this.url}/tickets/${id}`);
    }
}
