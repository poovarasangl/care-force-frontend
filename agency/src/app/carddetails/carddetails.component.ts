import { Component, OnInit } from '@angular/core';
import { CarddetailsService } from './carddetails.service';
import { AlertService } from '../alert/alert.service';
import { SpinnerService } from '../spinner/spinner.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StoreService } from '../store/store.service';
import { CONFIG } from '../config';
import * as moment from 'moment'

@Component({
  selector: 'app-carddetails',
  templateUrl: './carddetails.component.html',
  styleUrls: ['./carddetails.component.sass']
})
export class CarddetailsComponent implements OnInit {
  currentuser: any;
  taskpaymentdata: any;
  imageUrl = CONFIG.imageUrl;
  paymentlist: any;
  settingdata: any;
  carddetailsform: FormGroup
  yearlist: any;
  cardnumber_Error: String = ''
  submitted: boolean = false;
  submit_btn: number = 0;
  coupon: String = '';//Apply coupon string data
  couponbtn: number = 0;
  walletbtn: number = 0;
  paypalbtn: number = 0;
  DefaultCurrency: any;
  payamentdev: number = 0;
  urlparams: string = '';
  type: string = '';
  insbtn: number = 0;
  cashbtn: number = 0;

  constructor(private Apiservice: CarddetailsService,
    private toastr: AlertService,
    private spinner: SpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private store: StoreService,
    private formBuilder: FormBuilder,) { }

  ngOnInit() {
    this.carddetailsform = this.formBuilder.group({
      number: ['', Validators.compose([Validators.required, Validators.maxLength(16), Validators.minLength(16)])],
      exp_month: ['', [Validators.required]],
      exp_year: ['', [Validators.required]],
      cvv: ['', [Validators.required, Validators.maxLength(3)]],
    });
    var starttime = moment().startOf('year').format('YYYY');
    const times = 11;
    let timelist = [];
    for (let i = 0; i < times; i++) {
      timelist.push(moment(starttime).add(i, 'year').format('YYYY'));
    }
    this.yearlist = timelist;

    this.currentuser = JSON.parse(localStorage.getItem('currentuser'));
    let taskvalue = JSON.parse(localStorage.getItem('taskpayment'));
    this.store.landingdata.subscribe((setting: any) => {
      if (setting && setting.settings) {
        this.settingdata = setting.settings;
        this.Apiservice.paymentmode(setting.settings).subscribe((result: any) => {
          if (result.status === 1) {
            this.paymentlist = result.response;
          }
        })
      }
    });
    this.Apiservice.taskdetails({ taskid: taskvalue._id }).subscribe((result: any) => {
      if (result.status === 1) {
        if (result.response.invoice && result.response.invoice.amount && (result.response.invoice.amount.balance_amount === 0 || result.response.invoice.status === 1 || result.response.status === 7)) {
          localStorage.setItem('showtab', 'Detailstab');
          this.router.navigate(['/account/job-details']);
        } else {
          this.taskpaymentdata = result.response;
        }
      }
    });
    this.store.defaultcurrency.subscribe((result: any) => {
      if (result && result.code) {
        this.DefaultCurrency = result;
      }
    });
    this.urlparams = this.route.snapshot.paramMap.get('message');
    if (this.urlparams === 'failed') {
      this.payamentdev = 1;
    } else if (this.urlparams === 'success') {
      this.successmsg('Payment Successfully!');
    }
  }
  backpage() {
    this.payamentdev = 0;
  }
  applyCoupon() {
    this.showspinner();
    this.couponbtn = 1;
    let data = {
      coupon: this.coupon,
      task: this.taskpaymentdata._id,
      user: this.taskpaymentdata.user.user_id,
      service_tax: parseInt(this.settingdata.service_tax)
    }
    this.Apiservice.applyCoupon(data).subscribe((result: any) => {
      if (result.status === 1) {
        this.couponbtn = 0;
        this.taskpaymentdata = result.response[0];
        this.successmsg('Coupon Applied successfull!.');
        this.hidespinner();
        if(this.taskpaymentdata.status == 7){
          localStorage.setItem('showtab', 'Detailstab');
          setTimeout(() => {
            this.successmsg('Payment successfull!.');
            let item = { _id: this.taskpaymentdata.booking_id, status: this.taskpaymentdata.status };
            localStorage.setItem('carddetails', JSON.stringify(item));
            this.router.navigate(['/account/job-details']);
          }, 2000);
        }
      } else {
        this.hidespinner();
        this.couponbtn = 0;
        this.errorsmsg(result.response);
      }
    });
  }
  walletpayment(taskdata) {
    this.walletbtn = 1;
    this.showspinner();
    this.Apiservice.paybywallet({ task: taskdata, setting: this.settingdata }).subscribe((result: any) => {
      if (result.status === 1) {
        this.walletbtn = 0;
        this.successmsg('Payment successfull!.');
        this.hidespinner();
        this.ngOnInit();
      } else {
        this.walletbtn = 0;
        this.hidespinner();
        this.errorsmsg(result.response);
      }
    });
  }
  checklength(data) {

    if (data.target.value.length === 16) {
      this.cardnumber_Error = '';
    } else if (data.target.value.length === 0) {
      this.cardnumber_Error = '';
    } else {
      this.cardnumber_Error = 'Please Check Card Number';
    }
  }
  get cardformvalidation() { return this.carddetailsform.controls };


  onSubmit() {
    this.submitted = true;
    if (this.carddetailsform.invalid || this.cardnumber_Error != '') {
      return;
    }
    this.showspinner();
    this.submit_btn = 1;
    let data = {
      card: this.carddetailsform.value,
      task: this.taskpaymentdata
    }
    this.Apiservice.paybycard(data).subscribe((result: any) => {
      if (result.status === 1) {
        this.successmsg('Payment successfull!.');
        localStorage.setItem('showtab', 'Detailstab');
        setTimeout(() => {
          this.hidespinner();
          let item = { _id: this.taskpaymentdata.booking_id, status: this.taskpaymentdata.status };
          localStorage.setItem('carddetails', JSON.stringify(item));
          this.router.navigate(['/account/job-details']);
        }, 2000);
      } else {
        this.hidespinner();
        this.submit_btn = 0;
        this.errorsmsg(result.response.raw.message ? result.response.raw.message : result.response);
      }
    });
  }
  paypalPayment(item) {
    this.paypalbtn = 1;
    this.showspinner();
    let data = {
      task: item,
      setting: this.settingdata
    }
    this.Apiservice.paypalpayment(data).subscribe((result: any) => {
      if (result.status === 1) {
        this.paypalbtn = 0;
        this.hidespinner();
        window.location.href = result.redirectUrl;
      } else {
        this.paypalbtn = 0;
        this.hidespinner();
        this.errorsmsg(result.response);
      }
    });
  }
  offlinePayment(item,payment_type) {
    this.insbtn = 1;
    this.cashbtn = 1;
    this.showspinner();
    let data = {
      task: item,
      setting: this.settingdata,
      payment_type: payment_type
    }
    // setTimeout(()=>{
    //   this.insbtn = 0
    //   this.hidespinner();
    // },500)
    this.Apiservice.offlinepayment(data).subscribe((result: any) => {
      if (result && result.status == 1) {
        this.insbtn = 0;
        this.cashbtn = 0;
        this.hidespinner();
        this.successmsg('Completed Successfully');
        this.router.navigate(['/account/job-details']);
      } else {
        this.insbtn = 0;
        this.cashbtn = 0;
        this.hidespinner();
        this.errorsmsg(result.response);
      }
    });
  }

  codPayment(item) {
    this.insbtn = 1;
    this.cashbtn = 1;
  }

  removecoupon() {
    this.showspinner();
    let data = {
      task: this.taskpaymentdata._id,
      user: this.taskpaymentdata.user.user_id
    }
    this.Apiservice.RemoveCoupon(data).subscribe((result: any) => {
      if (result.status === 1) {
        this.hidespinner();
        this.coupon = '';
        this.taskpaymentdata = result.response;
      } else {
        this.hidespinner();
        this.errorsmsg(result.response);
      }
    });
  }

  successmsg(msg) {
    setTimeout(() => {
      this.toastr.clear();
    }, 2000);
    this.toastr.success(msg);
  }
  errorsmsg(msg) {
    setTimeout(() => {
      this.toastr.clear();
    }, 2000);
    this.toastr.error(msg);
  }
  warningmsg(msg) {
    setTimeout(() => {
      this.toastr.clear();
    }, 2000);
    this.toastr.warn(msg);
  }
  showspinner() {
    this.spinner.Spinner('show');
  }
  hidespinner() {
    this.spinner.Spinner('hide');
  }
}
