import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Apiconfig } from 'src/app/_services';
import { AdminService } from "src/app/_services/admin.service";

@Component({
  selector: 'app-paymentedit',
  templateUrl: './paymentedit.component.html',
  styleUrls: ['./paymentedit.component.scss']
})
export class PaymenteditComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  buttonDisabled = false;
  buttonState = '';
  editid: any;
  paymenteditdata: any;
  paymentdata: any;
  paymentsavedata = new FormData();
  spinner = 'none';

  constructor(private AdminService: AdminService,
    private notifications: NotificationsService,
    private route: ActivatedRoute,
    private router : Router) { }

  ngOnInit(): void {
    this.editid = this.route.snapshot.paramMap.get('id');
    if (this.editid) {
      this.showspinner();
      this.AdminService.CommonApi('post', Apiconfig.paymentedit, { id: this.editid }).subscribe(
        (results) => {
          if (results.status == 1) {
            this.hidespinner();
            this.paymentdata = results.response;
            this.paymenteditdata = results.response.settings;
            if(this.paymentdata.alias == 'stripe'){
              //stripe
              setTimeout(() => {
                this.form.form.controls['sandbox_publish_key'].setValue(this.paymenteditdata.sandbox_publish_key);
                this.form.form.controls['sandbox_secret_key'].setValue(this.paymenteditdata.sandbox_secret_key);
                this.form.form.controls['live_publish_key'].setValue(this.paymenteditdata.live_publish_key);
                this.form.form.controls['live_secret_key'].setValue(this.paymenteditdata.live_secret_key);
              }, 100);
            }else if(this.paymentdata.alias == 'payfast'){
              //payfast

            }else if(this.paymentdata.alias == 'paypal'){
              //paypal
              setTimeout(() => {
                this.form.form.controls['client_id'].setValue(this.paymenteditdata.client_id);
                this.form.form.controls['client_secret'].setValue(this.paymenteditdata.client_secret);
                this.form.form.controls['live_client_id'].setValue(this.paymenteditdata.live_client_id);
                this.form.form.controls['live_client_secret'].setValue(this.paymenteditdata.live_client_secret);
              }, 100);

            }            
            //common
            this.form.form.controls['mode'].setValue(this.paymenteditdata.mode);
            this.form.form.controls['status'].setValue(this.paymentdata.status+'');
          } else {
            this.hidespinner();
          }
        })
    }
  }
  onSubmit() {
    this.showspinner();
    let paymenteditsave = {settings :{}} as any;
    paymenteditsave.settings = this.form.form.value;
    paymenteditsave.status = this.form.form.value.status;
    paymenteditsave.alias = this.paymentdata.alias;
    paymenteditsave.gateway_name = this.paymentdata.gateway_name;
    paymenteditsave._id = this.paymentdata._id;
    delete paymenteditsave.settings.status;
    this.AdminService.CommonApi('post', Apiconfig.paymentsave, paymenteditsave).subscribe(
      (data) => {
        this.hidespinner();
        if (data.status == 1) {
          this.buttonDisabled = false;
          this.buttonState = 'show-spinner';
          this.notifications.create('Success', 'Payment Saved Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
          setTimeout(() => {
            this.router.navigate(['/app/gateway/paymentgateway/paymentlist']);
          }, 1000);
        } else {
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

