import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../config';

@Injectable({
  providedIn: 'root'
})
export class TaskerRegisterService {

  constructor(private http: HttpClient) { }

  public checkemail(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/users/checkemail`,data);
  }

  public Getdocumentdetails(): Observable<any> {
    return this.http.get(`${CONFIG.site_url}/users/document-list`);
  }

  public Getsubcategory(data):  Observable<any> {
    return this.http.post(`${CONFIG.site_url}/category/subcategorylist`,data);
  }

  public Getexperiencedetailas(): Observable<any> {
    return this.http.get(`${CONFIG.site_url}/users/tasker-experience-list`);
  }

  public Getdocumentfilepath(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/users/tasker-image-upload`,data);
  }

  public taskerRegister(data):  Observable<any> {
    return this.http.post(`${CONFIG.site_url}/users/tasker-register`,data);
  }

}
