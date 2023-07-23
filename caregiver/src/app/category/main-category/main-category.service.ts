import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from 'src/app/config';

@Injectable()
export class MainCategoryService {
  constructor(private http: HttpClient) { }

  public CategoryData(): Observable<any> {
    return this.http.get(`${CONFIG.site_url}/category/categorylist`);
  }
}
