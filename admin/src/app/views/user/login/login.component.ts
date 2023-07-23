import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthenticationService } from "../../../_services";
import { AdminService,Apiconfig } from "../../../_services";
import { environment } from "src/environments/environment";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm: NgForm;
  emailModel = '';
  passwordModel = '';
  imageUrl: string = environment.apiUrl;
  buttonDisabled = false;
  buttonState = '';
  settingData: any;
  adminlogo: string = '';


  constructor(private notifications: NotificationsService, private router: Router, private AuthenticationService: AuthenticationService, private AdminService: AdminService) { 
    this.AuthenticationService.currentUser.subscribe(data=>{
      if(data && typeof data.user != 'undefined'){
        this.router.navigate(['/app/dashboards']);
      }
    })
  }

  ngOnInit() {
    this.AdminService.CommonApi('get', Apiconfig.getSettingsData, {}).subscribe(
      (data) => {
        this.settingData = data.response
        this.adminlogo = this.settingData ? this.imageUrl + this.settingData.settings.logo : '';
      })
  }

  onSubmit() {
    if (!this.loginForm.valid || this.buttonDisabled) {
      return;
    }
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.AuthenticationService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe((user) => {
      if (user.user) {
        this.router.navigate(['/app/dashboards'])
      } else if (user.message && typeof user.user == 'undefined') {
        this.notifications.create('Error', user.message, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
        this.buttonState = ''
        this.buttonDisabled = false;
      }
    }, (error) => {
      this.buttonDisabled = false;
      this.notifications.create('Error', error.message, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
    });
  }
}
