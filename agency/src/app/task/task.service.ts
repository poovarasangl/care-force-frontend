import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CONFIG } from '../config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  public Gettaskerdetails(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/task/get-category`,data);
  }

  public Taskeravailability(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/task/get-tasker-availability`,data);
  }

  public addnewtask(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/task/add-new-task`,data);
  }
}
