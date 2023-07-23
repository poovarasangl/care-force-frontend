import { Injectable } from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';
import { StoreService } from '../store/store.service';

@Injectable({
  providedIn: 'root'
})
export class AppregGuard implements CanLoad {
    registerphone: any;
  constructor(private store: StoreService, private router: Router) {
    this.registerphone = JSON.parse(localStorage.getItem('registerphone'));
  }
  canLoad(route: Route): boolean {
    if (localStorage.getItem('registerphone')) {
      return true;
    }

    localStorage.setItem('retUrl',route.path);
    this.router.navigate(['/register']);
    return false;
  }
}
