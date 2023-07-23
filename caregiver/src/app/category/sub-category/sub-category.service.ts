import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from 'src/app/config';

@Injectable()
export class SubCategoryService {
  constructor(private http: HttpClient) { }

  public SubcategoryData(slug): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/category/subcategorylist`,slug);
  }
  public Gettaskerdetails(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/task/get-category`,data);
  }
}
