import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CONFIG } from '../config';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private http: HttpClient) { }

  public getmessage(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/message/get-message`, data);
  }
  public deleteConversation(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/message/delete-conversation`, data);
  }

}
