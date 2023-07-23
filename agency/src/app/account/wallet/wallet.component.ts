import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../alert/alert.service';
import { AccountService } from '../account.service';
import { AccountComponent } from '../account.component';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from '../../store/store.service';
import { SpinnerService } from '../../spinner/spinner.service';
import { ModalService } from '../../modal/modal.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.sass']
})
export class WalletComponent implements OnInit {

  walletamount: any;
  addmoney: number = 0;
  Wallet_Transactions_tab: boolean;
  Wallet_Recharge_tab: boolean;
  yearlist: any;
  submitted = false;
  cardnumber_Error: String = ''
  profiledata: any;
  walletdetails: any;
  paypal_btn = 0;
  submit_btn: number = 0;
  urlparams: string = '';
  payamentdev: number = 0;
  welletamountlist: any;
  DefaultCurrency: any;

  constructor(
    private toastr: AlertService,
    private ApiService: AccountService,
    private homepage: AccountComponent,
    private route: ActivatedRoute,
    private store: StoreService,
    private spinner: SpinnerService,
    private modalservice: ModalService
  ) { }

  ngOnInit() {
    this.Wallet_Transactions_tab = false;
    this.Wallet_Recharge_tab = true;
    localStorage.setItem('showtab', 'Wallettab');
    this.ApiService.Profiledetails.subscribe(result => {
      this.hidespinner();
      this.profiledata = result;
      if (result) {
        this.Getwalletdata(result as any);
      }
    });
    this.urlparams = this.route.snapshot.paramMap.get('message');
    if (this.urlparams === 'failed') {
      this.payamentdev = 1;
    } else if (this.urlparams === 'success') {
      this.successmsg('Payment Sucssfully!');
    }
    this.store.landingdata.subscribe((result: any) => {
      if (result && result.settings) {
        this.welletamountlist = result.settings.wallet;
        //this.DefaultCurrency = result.currencies.filter(x => x.default === 1)[0];
      }
    });
    this.store.defaultcurrency.subscribe((result: any) => {      
      if (result && result.code) {
        this.DefaultCurrency = result;
      }
    })
  }
  backpage() {
    this.payamentdev = 0;
  }
  Getwalletdata(data) {
    if (data && data._id) {
      this.ApiService.getwalletdetails({ userId: data._id }).subscribe(result => {
        if (result.status == 1) {
          this.walletdetails = result.response;
        } else {
          this.errorsmsg(result.response);
        }
      });
    }
  }
  addmoney_card() {
    if (this.walletamount > 0) {
      this.modalservice.showwallet('Payment', 'wallet', (value) => {
        if (value != '' && typeof value != 'undefined') {
          this.savewalletdata(value);
        }
      }, () => {
      });
    } else {
      this.errorsmsg('Please Enter The Amount To Add To The Wallet');
    }
  }

  savewalletdata(result) {
    let date = new Date();
    let expiryDate = new Date(result.exp_year, parseInt(result.exp_month), -1);
    if (expiryDate >= date) {
      if (this.walletamount != '') {
        let finalamount = this.walletamount / this.DefaultCurrency.value;
        this.showspinner();
        this.submit_btn = 1;
        let data = {
          rechargeamount: { amount: finalamount, currencyvalue: 1 },
          walletamount: finalamount,
          walletrecharge: { card: result }
        }
        this.ApiService.updatewallet({ data: data, user: this.profiledata._id }).subscribe(result => {
          this.hidespinner();
          if (result.status == 1) {
            this.walletamount = ''
            this.successmsg('Add amount successfully!!');
            this.ngOnInit();
            this.homepage.ngOnInit();
            this.modalservice.updatemessage();
          } else {
            this.ngOnInit();
            this.errorsmsg(result.response);
            this.modalservice.updatemessage();
          }
        });
      }
    } else {
      this.errorsmsg("Expiry month should not be lesser than current month")
    }
  }
  addmoney_paypal() {
    this.paypal_btn = 1;
    if (this.walletamount > 0) {
      this.showspinner();
      let data = {
        amount:  this.walletamount / this.DefaultCurrency.value
      }
      this.ApiService.updatewalletpaypal({ data: data, user: this.profiledata._id }).subscribe(result => {
        this.hidespinner();
        this.paypal_btn = 0;
        if (result.status == 1) {
          window.location.href = result.redirectUrl;
        } else {
          this.paypal_btn = 0;
          this.errorsmsg(result.response);
        }
      })
    } else {
      this.paypal_btn = 0;
      this.errorsmsg('Please Enter The Amount To Add To The Wallet');
    }
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