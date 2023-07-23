import { Component } from '@angular/core';
import { Router, Event, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html'
})

export class BreadcrumbComponent {
  path = '';
  pathArr: string[] = [];
  currentRoute = '';
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events
    .pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) { route = route.firstChild; }
        return route;
      })
    ).subscribe((event) => {
      this.path = this.router.url.slice(1, this.router.url.split('?')[0].length);
      const paramtersLen = Object.keys(event.snapshot.params).length;
      console.log( this.path.split('/').slice(0, this.path.split('/').length - paramtersLen)      );
      
      this.pathArr = this.path.split('/').slice(0, this.path.split('/').length - paramtersLen);
      console.log(this.pathArr);
      
      this.currentRoute = this.pathArr[this.pathArr.length - 1];

      console.log(this.currentRoute,'poooooooooooooooooooooooooooooooooooooooooooooooooo')
    });
  }

  getUrl = (sub: string) => {
    return '/' + this.path.split(sub)[0] + sub;
  }
}
