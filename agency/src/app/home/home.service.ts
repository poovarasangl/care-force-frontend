import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CONFIG } from '../config';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class HomeService {

  public category: BehaviorSubject<[]> = new BehaviorSubject<[]>([]);

  constructor(private http: HttpClient) { }

  public Getsubcategory(data):  Observable<any> {
    return this.http.post(`${CONFIG.site_url}/category/subcategorylist`,data);
  }

  public Gettaskerdetails(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/task/get-category`,data);
  }
  public subCategorylist(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/category/subcategorylist`,data);
  }
}
