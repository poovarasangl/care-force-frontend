import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { AdminService, Apiconfig } from "src/app/_services";

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss']
})
export class MobileComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  buttonDisabled = false;
  buttonState = '';
  mobiledatas: any;
  formSettingsData = new FormData();
  spinner = 'none';

  constructor(
    private AdminService: AdminService,
    private notifications: NotificationsService) { }

  ngOnInit(): void {
    this.showspinner();
    this.AdminService.CommonApi('get', Apiconfig.getSettingsData + '?alias=mobile', {}).subscribe(
      (results) => {
        this.hidespinner();
        this.mobiledatas = results.response.settings;
        this.form.form.controls['mode'].setValue(this.mobiledatas.apns.mode);
        this.form.form.controls['user_bundle_id'].setValue(this.mobiledatas.apns.user_bundle_id);
        this.form.form.controls['tasker_bundle_id'].setValue(this.mobiledatas.apns.tasker_bundle_id);
        this.form.form.controls['mapuserios'].setValue(this.mobiledatas.apns.mapuserios);
        this.form.form.controls['maptaskerios'].setValue(this.mobiledatas.apns.maptaskerios);
        this.form.form.controls['user'].setValue(this.mobiledatas.gcm.user);
        this.form.form.controls['tasker'].setValue(this.mobiledatas.gcm.tasker);
        this.form.form.controls['mapuserandroid'].setValue(this.mobiledatas.gcm.mapuserandroid);
        this.form.form.controls['maptaskerandroid'].setValue(this.mobiledatas.gcm.maptaskerandroid);
      })
  }
  onSubmit() {
    this.showspinner();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    if (this.form.form.valid) {
      let mobileformdata = this.form.form.value;
      this.formSettingsData.append('info', JSON.stringify(mobileformdata));
      this.formSettingsData.append('alias', 'mobile');
      this.AdminService.CommonApi('post', Apiconfig.saveSettingsData, this.formSettingsData).subscribe(
        (data) => {
          this.hidespinner();
          this.buttonDisabled = false;
          console.log(this.formSettingsData);          
          this.buttonState = '';
          this.notifications.create('Success', 'Mobile Settings Saved Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
          this.ngOnInit();
        }, (error) => {
          this.hidespinner();
					console.log(error);
				}) 
    }else{
      this.hidespinner();
      this.buttonDisabled = false;
          this.buttonState = '';
          this.notifications.create('Error', 'Please enter all madatory fields', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
        }
  }
  showspinner() {
    this.spinner = 'block'
  }
  hidespinner() {
    this.spinner = 'none';
  }
}
