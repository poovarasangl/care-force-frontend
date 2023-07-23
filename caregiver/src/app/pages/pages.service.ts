import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class PagesService {

  constructor(private http: HttpClient) { }

  public Getpage(slug): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/home/get-page`,slug);
  }
}
