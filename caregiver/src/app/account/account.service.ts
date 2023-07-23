import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CONFIG } from '../config';
import { Observable, BehaviorSubject } from 'rxjs';

const HttpUploadOptions = {
  headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
};
/* const HttpUploadOptions = {
  headers: new HttpHeaders({ "Accept": "application/json" })
} */
@Injectable()
export class AccountService {
  public Profiledetails: BehaviorSubject<[]> = new BehaviorSubject<[]>([]);
  constructor(private http: HttpClient) { }

  public profiledetails(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/users/get-profile`, data);
  }

  public generateOtp(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/users/generate-Otp`,data);
  }

  public updateprofile(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/users/updateprofile`, data);
  }
 
  public updateprofile_img(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/users/update-profile-img`, data);
  }

  public savetaskercategory(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/users/savecategory`, data);
  }
  public deetecategory(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/users/categorydelete`, data);
  }
  // public updatetaskerprofile(data): Observable<any> {
  //   return this.http.post(`${CONFIG.imageUrl}admin/taskers/remove-documents`, data);
  // }
  public updatetaskerprofile(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/users/remove-documents`, data);
  }
  public updateAvailablity(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/users/save-avaiablity`, data);
  }
  public saveAccountInfo(data): Observable<any> {
    return this.http.post(`${CONFIG.imageUrl}admin/taskers/remove-documents`, data);
  }
  public Getdocumentdetails(): Observable<any> {
    return this.http.get(`${CONFIG.site_url}/users/document-list`);
  }
  // public updatedocument(data): Observable<any> {
  //   return this.http.post(`${CONFIG.site_url}/users/update-document`,data);
  // }
  public updatedocument(data): Observable<any> {
    return this.http.post(`${CONFIG.imageUrl}admin/taskers/update-documents`,data);
  }
  // public adddocument(data): Observable<any> {
  //   return this.http.post(`${CONFIG.site_url}/users/add-document`,data);
  // }
  public adddocument(data): Observable<any> {
    return this.http.post(`${CONFIG.imageUrl}admin/taskers/add-documents`,data);
  }
  public updatewallet(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/payment/update-wallet`,data);
  }
  public getwalletdetails(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/payment/getwallet-details`,data);
  }
  public updatewalletpaypal(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/payment/update-wallet-paypal`,data);
  }
  public getreviewtoyou(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/review/get-review-to-you`,data);
  }
  public getreviewbyyou(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/review/get-review-by-you`,data);
  }
  public gettransaction(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/task/get-transaction`,data);
  }
  public gettasklist(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/task/get-task-list`,data);
  }
  public getcancelreason(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/task/get-cancel-reason`,data);
  }
  public usercanceltask(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/task/user-cancel-task`,data);
  }
  public getTaskDetailsByStaus(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/task/get-task-details`,data);
  }
  public taskerconfirmtask(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/task/tasker-confirm-task`,data);
  }
  public updatetaskstatus(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/task/update-task-status`,data);
  }
  public updatetaskcompletion(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/task/update-task-completion`,data);
  }
  public insertaskerReview(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/task/insert-tasker-review`,data);
  }
  public Getexperiencedetailas(): Observable<any> {
    return this.http.get(`${CONFIG.site_url}/users/tasker-experience-list`);
  }

  public Getsubcategory(data):  Observable<any> {
    return this.http.post(`${CONFIG.site_url}/category/subcategorylist`,data);
  }
}
