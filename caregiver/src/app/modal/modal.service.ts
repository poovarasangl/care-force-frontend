import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CONFIG } from '../config';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private subject = new Subject<any>();
  constructor(private http: HttpClient) { }

  public userdownloadPdf(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/users/userdownloadPdf`, data);
  }
  public downloadPdf(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/users/downloadPdf`, data);
  }

  show(message: string, item: any, modalname: string) {
    let user = JSON.parse(localStorage.getItem('currenttasker'));
    let data = {
      title: message,
      show: 'common',
      content: item,
      modalname: modalname,
      usertype: user.user_type
    }
    this.subject.next(data);
  }
 
  showwallet(message: string, modalname: string, siFn: (value) => void, noFn: () => void) {
    this.subject.next({
      title: message,
      modalname: modalname,
      show: 'wallet',
      siFn:
        function (value) {//this will close the modal
          siFn(value);
        },
      noFn: function () {
        noFn();
      }
    });
  }

  canceljob(message: string, modalname: string,item, siFn: (value) => void, noFn: () => void) {
    this.subject.next({
      title: message,
      modalname: modalname,
      content: item,
      show: 'canceljob',
      siFn:
        function (value) {//this will close the modal
          siFn(value);
        },
      noFn: function () {
        noFn();
      }
    });
  }
  
  completedjob(message: string, modalname: string,item, siFn: (value) => void, noFn: () => void) {
    this.subject.next({
      title: message,
      modalname: modalname,
      content: item,
      show: 'completedjob',
      siFn:
        function (value) {//this will close the modal
          siFn(value);
        },
      noFn: function () {
        noFn();
      }
    });
  }

    
  reviewjob(message: string, modalname: string, siFn: (value) => void, noFn: () => void) {
    this.subject.next({
      title: message,
      modalname: modalname,
      show: 'reviewjob',
      siFn:
        function (value) {//this will close the modal
          siFn(value);
        },
      noFn: function () {
        noFn();
      }
    });
  }
  categoryadd(message: string, modalname: string,item:any, siFn: (value) => void, noFn: () => void) {
    this.subject.next({
      title: message,
      modalname: modalname,
      content: item,
      show: modalname,
      siFn:
        function (value) {//this will close the modal
          siFn(value);
        },
      noFn: function () {
        noFn();
      }
    });
  }
  categoryedit(message: string, modalname: string,item:any, siFn: (value) => void, noFn: () => void) {
    this.subject.next({
      title: message,
      modalname: modalname,
      content: item,
      show: modalname,
      siFn:
        function (value) {//this will close the modal
          siFn(value);
        },
      noFn: function () {
        noFn();
      }
    });
  }
  document(message: string, modalname: string,item:any,doclist:any,profileid:any,siFn: () => void, noFn: () => void) {
    this.subject.next({
      title: message,
      modalname: modalname,
      content: item,
      doclist : doclist,
      show: modalname,
      profileid : profileid,
      siFn:
        function () {//this will close the modal
          siFn();
        },
      noFn: function () {
        noFn();
      }
    });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
  updatemessage(){
    this.subject.next({});
  }
}