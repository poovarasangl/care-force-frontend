import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CONFIG } from '../config';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private http: HttpClient) { }

  public landingData(): Observable<any> {
    return this.http.get(`${CONFIG.site_url}/home/site-homepage`);
  }

  public subscriptionemail(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/users/subscription`,data);
  }
}
