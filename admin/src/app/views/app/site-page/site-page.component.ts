import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-site-page',
  templateUrl: './site-page.component.html'
})
export class SitePageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
