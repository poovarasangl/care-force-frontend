import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from '../config';
import { Observable, BehaviorSubject } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient, private socket: Socket) {}

  public getchathistory(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/message/chat-history`, data);
  }

}
