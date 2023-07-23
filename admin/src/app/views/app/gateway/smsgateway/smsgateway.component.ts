import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Apiconfig } from 'src/app/_services';
import { AdminService } from "src/app/_services/admin.service";

@Component({
  selector: 'app-smsgateway',
  templateUrl: './smsgateway.component.html',
  styleUrls: ['./smsgateway.component.scss']
})
export class SmsgatewayComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  buttonDisabled = false;
  buttonState = '';
  smsdata: any;
  smseditdata: any;
  status: any;
  spinner = 'none';
  constructor(private AdminService: AdminService,
    private notifications: NotificationsService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.showspinner();
    this.AdminService.CommonApi('post', Apiconfig.smsgateedit, {}).subscribe(
      (results) => {
        this.hidespinner();
        this.smsdata = results.response;
        this.smseditdata = results.response.settings.twilio;

        this.form.form.controls['account_sid'].setValue(this.smseditdata.account_sid);
        this.form.form.controls['authentication_token'].setValue(this.smseditdata.authentication_token);
        this.form.form.controls['default_phone_number'].setValue(this.smseditdata.default_phone_number);
        this.form.form.controls['mode'].setValue(this.smseditdata.mode);
      })
  }
  onSubmit() {
    this.showspinner();
    let smssavedata = { twilio: { } } as any;
    smssavedata.twilio = this.form.form.value;
    // smssavedata.alias = this.smsdata.alias;
    // smssavedata.createdAt = this.smsdata.createdAt;
    // smssavedata.updatedAt = this.smsdata.updatedAt;
    // smssavedata._id = this.smsdata._id;
    // delete smssavedata.status;

    this.AdminService.CommonApi('post', Apiconfig.smsgatesave, smssavedata).subscribe(
      (data) => {
        if (data.status == 1) {
          this.hidespinner();
          this.buttonDisabled = false;
          this.buttonState = 'show-spinner';
          this.notifications.create('Success', 'Sms settings Saved Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
        } else {
          this.hidespinner();
          this.notifications.create('Error', 'Please enter all madatory fields', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
        }
      }, (error) => {
        this.hidespinner();
        this.notifications.create('Error', error.message, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
      })
  }
  showspinner() {
    this.spinner = 'block'
  }
  hidespinner() {
    this.spinner = 'none';
  }
}
