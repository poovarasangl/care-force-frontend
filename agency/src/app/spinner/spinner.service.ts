import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private subject = new Subject<any>();
  constructor() { }
  Spinner(message: string) {
    if (message === 'show') {
      this.subject.next('block');
    } else {
      this.subject.next('none');
    }
  }
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}