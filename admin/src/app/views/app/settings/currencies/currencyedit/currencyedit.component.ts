import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { AdminService, Apiconfig } from "src/app/_services";

@Component({
  selector: 'app-currencyedit',
  templateUrl: './currencyedit.component.html',
  styleUrls: ['./currencyedit.component.scss']
})
export class CurrencyeditComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  buttonDisabled = false;
  buttonState = '';
  editid: any;
  currencyeditdata: any;
  spinner = 'none';
  constructor(
    private AdminService: AdminService,
    private notifications: NotificationsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.showspinner();
    this.editid = this.route.snapshot.paramMap.get('id');
    if (this.editid) {
      this.hidespinner();
      this.AdminService.CommonApi('post', Apiconfig.currencyedit, { id: this.editid }).subscribe(
        (results) => {
          if (results.status == 1) {
            this.currencyeditdata = results.response;
            this.form.form.controls['name'].setValue(this.currencyeditdata.name);
            this.form.form.controls['code'].setValue(this.currencyeditdata.code);
            this.form.form.controls['symbol'].setValue(this.currencyeditdata.symbol);
            this.form.form.controls['value'].setValue(this.currencyeditdata.value);
            this.form.form.controls['status'].setValue(this.currencyeditdata.status+'');
          }
        })
    } else {
      this.hidespinner();
    }

  }
  onSubmit() {
    let currencyediteddata = this.form.form.value;
    if(currencyediteddata.value <= 0){
      this.notifications.create('Error', 'Currency value should be more than Zero', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
      return
    }
    currencyediteddata._id = this.editid;
    currencyediteddata.default = currencyediteddata.default? this.currencyeditdata.default : 0;
    currencyediteddata.featured = currencyediteddata.featured ? this.currencyeditdata.featured : 0;
    if (this.form.form.valid) {
      this.showspinner();
      this.AdminService.CommonApi('post', Apiconfig.currencysave, currencyediteddata).subscribe(
        (data) => {
          if (data.status == 1) {
            this.hidespinner();
            this.buttonDisabled = false;
            this.buttonState = 'show-spinner';
            this.notifications.create('Success', 'Currency Saved Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
            this.ngOnInit();
            setTimeout(() => {
              this.router.navigate(['app/settings/currencies/currencylist']);
            }, 1000);
          }else{
            this.hidespinner();
            this.notifications.create('Error', data.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
          }
        }, (error) => {
          this.hidespinner();
          this.notifications.create('Error', error.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
        })
    } else {
      this.hidespinner();
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
