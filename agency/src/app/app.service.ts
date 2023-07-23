import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StoreService } from './store/store.service';
import { CONFIG } from './config';

@Injectable({
	providedIn: 'root'
})
export class AppService {
	currentUser:any;

	constructor(private store: StoreService,private http: HttpClient) {
		this.store.Userdetails.subscribe((respo: any) => {
			this.currentUser = respo;			
		})
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {		
		// add authorization header with jwt token if available
		if (this.currentUser && this.currentUser.language) {
			request = request.clone({
				setHeaders: {
					'Accept-Language': this.currentUser.language || 'en'
				}
			});
		}
		return next.handle(request);
	}

	public SavecontactUs(data): Observable<any> {
		return this.http.post(`${CONFIG.site_url}/home/save-contact-us`,data);
	  }
}
