import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { InitialStateSchema, initialState } from './intial-state';
import { CONFIG } from '../config';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private store: BehaviorSubject<InitialStateSchema> = new BehaviorSubject<InitialStateSchema>(initialState);

  constructor(private http: HttpClient) { }

  public getStateSnapshot(): InitialStateSchema {
    return this.store.value;
  }
  public sidebar: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public headermsg: BehaviorSubject<any> = new BehaviorSubject<any>('');

  public category: BehaviorSubject<[]> = new BehaviorSubject<[]>([]);
  public landingdata: BehaviorSubject<[]> = new BehaviorSubject<[]>([]);
  public Useravater: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public openmodal: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public selectedcategory: BehaviorSubject<[]> = new BehaviorSubject<[]>([]);
  public taskdetails: BehaviorSubject<[]> = new BehaviorSubject<[]>([]);
  public taskdescribe: BehaviorSubject<{}> = new BehaviorSubject<{}>('');
  public Url: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public walletadddata: BehaviorSubject<{}> = new BehaviorSubject<{}>('');
  public Canceljob: BehaviorSubject<{}> = new BehaviorSubject<{}>('');
  public completedjob: BehaviorSubject<{}> = new BehaviorSubject<{}>('');
  public reviewjob: BehaviorSubject<{}> = new BehaviorSubject<{}>('');
  public documentaddedit: BehaviorSubject<{}> = new BehaviorSubject<{}>('');

public defaultlang: BehaviorSubject<string> = new BehaviorSubject<string>('');

public defaultcurrency: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public notificationemit : BehaviorSubject<string> = new BehaviorSubject<string>('');

  public Userdetails : BehaviorSubject<{}> = new BehaviorSubject<{}>('');

  public SocketListen : BehaviorSubject<{}> = new BehaviorSubject<{}>('');

  public getState(): Observable<InitialStateSchema> {
    return this.store.pipe(distinctUntilChanged());
  }

  public select<K extends keyof InitialStateSchema>(key: K): Observable<InitialStateSchema[K]> {
    var selectStream = this.store.pipe(
      map(
        (state: InitialStateSchema) => {

          return (state[key]);

        }
      ),
      distinctUntilChanged()
    );
    return (selectStream);
  }

  public setState(partialState: Partial<InitialStateSchema>): void {
    const currentState: InitialStateSchema = this.getStateSnapshot();
    var nextState = Object.assign({}, currentState, partialState);

    this.store.next(nextState);

  }
  public profiledetails(data): Observable<any> {
    return this.http.post(`${CONFIG.site_url}/users/get-profile`, data);
  }

}
