import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from 'src/app/_services';
import { NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Apiconfig } from '../../../../_services';


@Component({
  selector: 'app-seo',
  templateUrl: './seo.component.html',
  styleUrls: ['./seo.component.scss']
})
export class SeoComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  buttonDisabled = false;
  buttonState = '';
  seoData: any;
  formSettingsData = new FormData();
  webmaster: any = { amount: {} };
  spinner = 'none';

  constructor(
    private AdminService: AdminService,
    private notifications: NotificationsService
  ) { }

  ngOnInit(): void {
    this.showspinner();
    this.formSettingsData = new FormData();
    this.AdminService.CommonApi('get', Apiconfig.getSettingsData + '?alias=seo', {}).subscribe
      ((results) => {
        this.hidespinner();
        this.seoData = results.response.settings;
        if (results && typeof this.seoData.seo_title != 'undefined') {
          this.form.form.controls['seo_title'].setValue(this.seoData.seo_title);
          this.form.form.controls['focus_keyword'].setValue(this.seoData.focus_keyword);
          this.form.form.controls['meta_description'].setValue(this.seoData.meta_description);
          this.form.form.controls['google_analytics'].setValue(this.seoData.webmaster.google_analytics);
        }
      },
        (error) => {
          this.hidespinner();
          console.log(error);
        })
  }

  onSubmit() {
    this.showspinner();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    
    if (this.form.form.valid) {
      let seosettingData = this.form.form.value;
      seosettingData.webmaster = {};
      seosettingData.webmaster.google_analytics = this.form.form.value.google_analytics;
      this.formSettingsData.append('info', JSON.stringify(seosettingData));
      this.formSettingsData.append('alias', 'seo');
      this.AdminService.CommonApi('post', Apiconfig.saveSettingsData, this.formSettingsData).subscribe(
        (data) => {
          this.hidespinner();
          this.buttonDisabled = false;
          this.buttonState = '';
          this.notifications.create('Success', 'Seo Settings Saved Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
          this.ngOnInit();
        }, (error) => {
          this.notifications.create('Error', error.msg, NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
					console.log(error);
				}) 
      } else {
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
