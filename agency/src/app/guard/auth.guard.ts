import { Injectable } from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';
import { StoreService } from '../store/store.service';

@Injectable({
  providedIn: 'root'
})
export class AppGuard implements CanLoad {
  currentuser: any;
  constructor(private store: StoreService, private router: Router) {
this.currentuser = JSON.parse(localStorage.getItem('currentuser'));
  }
  canLoad(route: Route): boolean {
    if (this.currentuser) {
      return true;
    }

    localStorage.setItem('retUrl',route.path);
    this.router.navigate(['/login']);
    return false;
  }
}
