import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { AdminService, Apiconfig } from 'src/app/_services';

@Component({
  selector: 'app-smtp',
  templateUrl: './smtp.component.html',
  styleUrls: ['./smtp.component.scss']
})
export class SmtpComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  buttonDisabled = false;
  buttonState = '';
  seoData:any;
  smtpdata: any;
  formSettingsData = new FormData();
  spinner = 'none';

  constructor(
    private AdminService: AdminService,
    private notifications: NotificationsService
  ) { }

  ngOnInit(): void {
    this.showspinner();
    this.AdminService.CommonApi('get',  Apiconfig.getSettingsData + '?alias=smtp', {}).subscribe(
      (results)=>{
        this.hidespinner();
        this.smtpdata = results.response.settings;
        this.form.form.controls['smtp_host'].setValue(this.smtpdata.smtp_host); 
        this.form.form.controls['smtp_port'].setValue(this.smtpdata.smtp_port);       
        this.form.form.controls['smtp_username'].setValue(this.smtpdata.smtp_username);       
        this.form.form.controls['smtp_password'].setValue(this.smtpdata.smtp_password);
        this.form.form.controls['mode'].setValue(this.smtpdata.mode);      
    })
  }onSubmit() {
    this.showspinner();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    if (this.form.form.valid) {
      let smtpsettingData = this.form.form.value;
      this.formSettingsData.append('info', JSON.stringify(smtpsettingData));
      this.formSettingsData.append('alias', 'smtp');
      this.AdminService.CommonApi('post', Apiconfig.saveSettingsData, this.formSettingsData).subscribe(
        (data) => {
          this.hidespinner();
          this.buttonDisabled = false;
          this.buttonState = '';
          this.notifications.create('Success', 'smtp Settings Saved Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
          this.ngOnInit();
        }, (error) => {
          this.hidespinner();
          console.log(error);
        })
    }
    else {
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
