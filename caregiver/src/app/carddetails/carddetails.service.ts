import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CONFIG } from '../config';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarddetailsService {

  constructor(private http: HttpClient) { }

  public taskdetails(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/task/get-task`,data);
  }

  public paymentmode(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/payment/payment-mode`,data);
  }
  public applyCoupon(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/payment/apply-coupon`,data);
  }
  public paybywallet(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/payment/pay-by-wallet`,data);
  }
  public paybycard(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/payment/pay-by-card`,data);
  }
  public paypalpayment(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/payment/paypal-payment`,data);
  }
  public RemoveCoupon(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/payment/remove-coupon`,data);
  }
}
