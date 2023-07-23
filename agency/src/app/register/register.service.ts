import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CONFIG } from '../config';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  url ='';
  constructor(private http: HttpClient) { }

  public phonenumbercheck(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/users/phone-check`,data);
  }

  public generateOtp(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/users/generate-Otp`,data);
  }

  public checkemail(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/users/checkemail`,data);
  }

  public userregister(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/users/user-register`,data);
  }
}
