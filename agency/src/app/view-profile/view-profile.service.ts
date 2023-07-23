import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class ViewProfileService {

  constructor(private http: HttpClient) { }

  public viewprofile(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/users/view-profile`,data);
  }
  public addnewtask(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/task/add-new-task`,data);
  }

}
