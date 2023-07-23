import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Apiconfig, AdminService } from "../../../../_services";
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-addcoupon',
  templateUrl: './addcoupon.component.html',
  styleUrls: ['./addcoupon.component.scss']
})
export class AddcouponComponent implements OnInit {

  @ViewChild('form') form: NgForm;
  buttonDisabled = false;
  buttonState = '';
  discountType: any;
  removeLabel = true;
  percentageValue: boolean;
  limitPerCoupon: number;
  limitPerUser: number;
  couponValue: boolean;
  spinner = 'none';
  constructor(

    private AdminService: AdminService,
    private notifications: NotificationsService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute
  ) { }
  title = "";

  latest_date = new Date();
  end_date = new Date();
  discount_type = '';

  ngOnInit() {

    const id = this.ActivatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.showspinner();
      this.title = "Edit";
      this.AdminService.CommonApi('post', Apiconfig.CouponEdit, { id: id }).subscribe(
        (result) => {
          if (result) {
            this.hidespinner();
            this.form.form.controls['coupon_id'].setValue(result.response._id);
            this.form.form.controls['name'].setValue(result.response.name);
            this.form.form.controls['code'].setValue(result.response.code);
            this.form.form.controls['description'].setValue(result.response.description);
            this.form.form.controls['discount_type'].setValue(result.response.discount_type);
            this.form.form.controls['status'].setValue(result.response.status);
            this.form.form.controls['amount_percentage'].setValue(result.response.amount_percentage);
            var valid_from = new DatePipe('en-US').transform(result.response.valid_from, 'yyyy-MM-dd');
            this.form.form.controls['valid_from'].setValue(valid_from);
            var expiry_date = new DatePipe('en-US').transform(result.response.expiry_date, 'yyyy-MM-dd');
            this.form.form.controls['expiry_date'].setValue(expiry_date);
            this.form.form.controls['per_user'].setValue(result.response.usage.per_user);
            this.form.form.controls['total_coupons'].setValue(result.response.usage.total_coupons);
            this.discountType = result.response.discount_type;
            this.limitPerCoupon = result.response.usage.total_coupons;
            this.limitPerUser = result.response.usage.per_user;
          }
        }, (error) => {
          this.hidespinner();
          console.log(error);
        })
    } else {
      this.hidespinner();
      this.title = "Add New";
    }
  }
  couponUsageCheck() {
    this.limitPerCoupon = this.form.form.get('total_coupons').value;
    this.limitPerUser = this.form.form.get('per_user').value;
    if (this.limitPerCoupon <= this.limitPerUser) {
      this.couponValue = false;
      this.notifications.create('Error', "Limit per user can't be greater than Coupon count", NotificationType.Error, { theClass: 'outline', timeOut: 6000, showProgressBar: true });
    } else {
      this.couponValue = true;
    }
  }
  discountTypeCheck(event) {
    if (event.id == "Flat") {
      this.discountType = event.id;
    } else if (event.id == "Percentage") {
      this.discountType = event.id;
    }
  }
  percentageCheck() {
    if (this.discountType == "Percentage") {
      let data = this.form.form.get('amount_percentage').value;
      if (data <= 100) {
        this.percentageValue = true;
      } else {
        this.percentageValue = false;
        this.notifications.create('Error', "Percentage value can't exceed more than 100", NotificationType.Error, { theClass: 'outline', timeOut: 6000, showProgressBar: true });
      }
    }
  }
  onClick() {
    this.couponUsageCheck();
    if (this.discountType == 'Percentage') {
      this.percentageCheck();
      if (this.percentageValue && this.couponValue) {
        this.onSubmit();
      } else {
        return false;
      }
    } else if (this.couponValue) {
      this.onSubmit();
    }
  }
  validDateChange(event) {
    this.end_date = event;
  }

  onSubmit() {
    this.showspinner();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';

    if (this.form.form.valid) {
      var data = {
        '_id': this.form.form.get('coupon_id').value,
        'name': this.form.form.get('name').value,
        'code': this.form.form.get('code').value,
        'discount_type': this.form.form.get('discount_type').value,
        'amount_percentage': this.form.form.get('amount_percentage').value,
        'description': this.form.form.get('description').value,
        'valid_from': this.form.form.get('valid_from').value,
        'expiry_date': this.form.form.get('expiry_date').value,
        'status': this.form.form.get('status').value
      };
      data['usage'] = {
        'per_user': this.form.form.get('per_user').value,
        'total_coupons': this.form.form.get('total_coupons').value
      };
      this.AdminService.CommonApi('post', Apiconfig.CouponSave, data).subscribe(
        (data) => {
          this.buttonDisabled = false;
          this.buttonState = '';
          if (data) {
            if (data.status == 1) {
              this.hidespinner();
              this.buttonDisabled = false;
              this.buttonState = 'show-spinner';
              this.notifications.create('Success', data.message, NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });

              setTimeout(() => {
                this.router.navigate(['/app/coupons/list']);
              }, 1000);
            } else {
              this.hidespinner();
              this.buttonDisabled = false;
              this.buttonState = '';
              this.notifications.create('Error', data.response, NotificationType.Error, { theClass: 'outline', timeOut: 6000, showProgressBar: true });
            }
          }
        }, (error) => {
          this.hidespinner();
          this.buttonDisabled = false;
          this.buttonState = '';
          this.notifications.create('Error', error.message, NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
        })
    }
    else {
      this.hidespinner();
      this.buttonDisabled = false;
      this.buttonState = '';
      this.notifications.create('Error', 'Please Enter all mandatory fields', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
    }
  }
  showspinner() {
    this.spinner = 'block'
  }
  hidespinner() {
    this.spinner = 'none';
  }

}
