import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingComponent implements OnInit {

  constructor(private router: Router) {
    // If you have landing page, remove below line and implement it here.
    // this.router.navigateByUrl('/app');
  }
  ngOnInit() {
    
  }

}
