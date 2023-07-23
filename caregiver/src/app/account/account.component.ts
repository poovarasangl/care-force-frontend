import { Component, OnInit } from '@angular/core';
import { AlertService } from '../alert/alert.service'
import { Router } from '@angular/router';
import { AccountService } from './account.service';
import { CONFIG } from '../config';
import { StoreService } from '../store/store.service';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { SpinnerService } from '../spinner/spinner.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.sass']
})
export class AccountComponent implements OnInit {
  currentuser: any = {};
  profile: any;
  role: any;
  profiletab: boolean;
  Abouttab = true;
  Reviewstab: boolean;
  Availabilitytab: boolean;
  Documentstab: boolean;
  InviteFriendstab: boolean;
  Detailstab: boolean;
  Categorytab: boolean;
  Accounttab: boolean;
  imageUrl = CONFIG.imageUrl;
  Wallettab: boolean;
  Transactionstab: boolean;
  walletshow:boolean = false;
  currentUserName : String;
  currentUserCode : String;
  currentUserNumber: String;

  constructor(private router: Router,
    private toastr: AlertService,
    private ApiService: AccountService,
    private store: StoreService,
    private sweetalert: ConfirmDialogService,
    private spinner: SpinnerService) { }

  ngOnInit() {
    this.Documentstab = false;
    this.profiletab = false;
    this.Abouttab = false;
    this.Detailstab = false;
    this.InviteFriendstab = false;
    this.Availabilitytab = false;
    this.Reviewstab = false;
    this.Categorytab = false;
    this.Accounttab = false;
    this.Wallettab = false;
    this.Transactionstab = false;

    this.currentuser = JSON.parse(localStorage.getItem('currenttasker'));
    this.role = this.currentuser.user_type;
    // this.store.Useravater.subscribe(({ avatar }) => {
    //   if (avatar) {
    //     this.currentuser.avatar = avatar;
    //   }
    // });
    const data = {
      userId: this.currentuser.user_id,
      userrole: this.currentuser.user_type
    }
    this.ApiService.profiledetails(data).subscribe(result => {
      if (result.status === 1) {
        this.currentuser.user = result.response[0].username;
        this.currentuser.code = result.response[0].phone.code;
        this.currentuser.phone = result.response[0].phone.number;
        this.ApiService.Profiledetails.next(result.response[0]);
        this.store.headermsg.next(result.response[0]);
        this.profile = result.response[0];
        this.currentUserName = result.response[0].username;
        this.currentUserCode = result.response[0].phone.code;
        this.currentUserNumber = result.response[0].phone.number;
      } else {
        this.errorsmsg(result.response);
      }
    });

    this.store.Userdetails.subscribe((result:any)=>{
      if(result && typeof result.phone !='undefined' && result.username !='undefined'){
        this.currentUserName = result.username;
        this.currentUserCode = result.phone.code;
        this.currentUserNumber = result.phone.number;
        this.currentuser.avatar = result.avatar;
      }
    });

    if (localStorage.getItem('showtab') === 'Documentstab') {
      this.Documentstab = true;
      localStorage.removeItem('showtab');
      this.router.navigate(['/account/documents']);
    } else if (localStorage.getItem('showtab') === 'profiletab') {
      this.profiletab = true;
      localStorage.removeItem('showtab');
      this.router.navigate(['/account/profile']);
    } else if (localStorage.getItem('showtab') === 'Abouttab') {
      this.Abouttab = true;
      localStorage.removeItem('showtab');
      this.router.navigate(['/account/about']);
    } else if (localStorage.getItem('showtab') === 'Detailstab') {
      this.Detailstab = true;
      localStorage.removeItem('showtab');
      this.router.navigate(['/account/job-details']);
    } else if (localStorage.getItem('showtab') === 'InviteFriendstab') {
      this.InviteFriendstab = true;
      localStorage.removeItem('showtab');
      this.router.navigate(['/account/invite-friends']);
    } else if (localStorage.getItem('showtab') === 'Reviewstab') {
      this.Reviewstab = true;
      localStorage.removeItem('showtab');
      this.router.navigate(['/account/reviews']);
    } else if (localStorage.getItem('showtab') === 'Categorytab') {
      this.Categorytab = true;
      localStorage.removeItem('showtab');
      this.router.navigate(['/account/category']);
    } else if (localStorage.getItem('showtab') === 'Availabilitytab') {
      this.Availabilitytab = true;
      localStorage.removeItem('showtab');
      this.router.navigate(['/account/availability']);
    } else if (localStorage.getItem('showtab') === 'Accounttab') {
      this.Accounttab = true;
      localStorage.removeItem('showtab');
      this.router.navigate(['/account/bank-account']);
    } else if (localStorage.getItem('showtab') === 'Wallettab') {
      this.Wallettab = true;
      localStorage.removeItem('showtab');
      this.router.navigate(['/account/wallet', 'message']);
    } else if (localStorage.getItem('showtab') === 'Transactionstab') {
      this.Transactionstab = true;
      localStorage.removeItem('showtab');
      this.router.navigate(['/account/transactions']);
    } else {
      this.profiletab = true;
    }
    this.store.landingdata.subscribe((respo:any)=>{
      if(respo && respo.settings && respo.settings.wallet){
        this.walletshow = respo.settings.wallet.status == 1 ? true : false;
      }
    })
  }

  logout() {
    let contend = '<span>Are you sure?</span><br><span>You Will Be Logout From This Session!</span>';
    this.sweetalert.confirmlogout(contend, () => {
      this.store.Useravater.next('');
      localStorage.clear();
      this.store.Userdetails.next('');
      this.router.navigate(['/']);
      this.successmsg('Successfully logout!!');
    }, () => {
      this.sweetalert.updatemessage(); 
    });
  }
  profilepage(){
    if(this.router.url === '/account/profile'){
      this.hidespinner();
    } else {
      this.showspinner();
      this.router.navigate(['/account/profile']);
    }
  }
  jobdetailspage(){
    if(this.router.url === '/account/job-details'){
      this.hidespinner();
    } else {
      this.showspinner();
      this.router.navigate(['/account/job-details']);
    }
  }
  invitefriendspage(){
    if(this.router.url === '/account/invite-friends'){
      this.hidespinner();
    } else {
      this.showspinner();
      this.router.navigate(['/account/invite-friends']);
    }
  }
  walletpage(){
    if(this.router.url === '/account/wallet'){
      this.hidespinner();
    } else {
      this.showspinner();
      this.router.navigate(['/account/wallet','message']);
    }
  }
  transactionspage(){
    if(this.router.url === '/account/transactions'){
      this.hidespinner();
    } else {
      this.showspinner();
      this.router.navigate(['/account/transactions']);
    }
  }
  reviewspage(){
    if(this.router.url === '/account/reviews'){
      this.hidespinner();
    } else {
      this.showspinner();
      this.router.navigate(['/account/reviews']);
    }
  }
  aboutpage(){
    if(this.router.url === '/account/about'){
      this.hidespinner();
    } else {
      this.showspinner();
      this.router.navigate(['/account/about']);
    }
  }
  accountpage(){
    if(this.router.url === '/account/bank-account'){
      this.hidespinner();
    } else {
      this.showspinner();
      this.router.navigate(['/account/bank-account']);
    }
  
  }
  categorypage(){
    if(this.router.url === '/account/category'){
      this.hidespinner();
    } else {
      this.showspinner();
      this.router.navigate(['/account/category']);
    }
  }
  availabilitypage(){
    if(this.router.url === '/account/availability'){
      this.hidespinner();
    } else {
      this.showspinner();
      this.router.navigate(['/account/availability']);
    }
  }
  documentspage(){
    if(this.router.url === '/account/documents'){
      this.hidespinner();
    } else {
      this.showspinner();
      this.router.navigate(['/account/documents']);
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
    this.spinner.Spinner('hide');
  }
  hidespinner() {
    this.spinner.Spinner('hide');
  }
}