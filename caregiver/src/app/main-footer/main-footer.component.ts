import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { AlertService } from '../alert/alert.service';
import { StoreService } from '../store/store.service';
import { CONFIG } from '../config';
import { Router } from '@angular/router';
import { TranslateService } from "../shared/Translate/translate.service";

@Component({
  selector: 'app-main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.sass']
})
export class MainFooterComponent implements OnInit {
  language = localStorage.getItem('lang');
  Settings = {
    appstore: [] as any,
    social: [] as any,
  } as any;
  currencies: any;
  Languages: any;
  submitted: boolean;
  error_msg: any;
  pages: any;
  subscription: string = '';
  imageUrl = CONFIG.imageUrl;
  languagevalue: string = '';
  currencyvalue: string = '';

  constructor(private ApiService: SharedService,
    private toastr: AlertService,
    private store: StoreService,
    private router: Router,
    private elementRef: ElementRef,
    private translate: TranslateService,) {
  }

  ngOnInit() {
    this.ApiService.landingData().subscribe(result => {
      this.Settings = result.settings;
      this.currencies = result.currencies;
      this.Languages = result.language;
      this.pages = result.pages;
      this.store.landingdata.next(result);
      this.store.category.next(result.categories);
      localStorage.setItem('categories', JSON.stringify(result.categories));
      if (!localStorage.getItem('lang')) {
        localStorage.setItem('lang', JSON.stringify(this.Languages.filter(x => x.default === 1)[0]));
      }
      if (!localStorage.getItem('currency')) {
        localStorage.setItem('currency', JSON.stringify(this.currencies.filter(x => x.default === 1)[0]));
      }
      this.languagevalue = JSON.parse(localStorage.getItem('lang')).code;
      this.currencyvalue = JSON.parse(localStorage.getItem('currency')).code;
      this.store.defaultlang.next(this.languagevalue);
      this.store.defaultcurrency.next(JSON.parse(localStorage.getItem('currency')));
      this.translate.use(this.languagevalue);
      this.elementRef.nativeElement.querySelector('.handy-home-footer').click();
    });
  }
  emailchange(email) {
    this.subscription = email;
  }
  currency(val) {
    let crn = this.currencies.filter(x => x.code === val)[0];
    this.store.defaultcurrency.next(crn);
    localStorage.setItem('currency', JSON.stringify(crn));
    window.scrollTo(0, 0);
    this.elementRef.nativeElement.querySelector('.handy-home-footer').click();
  }
  lang(val) {
    let lng = this.Languages.filter(x => x.code === val)[0];
    this.store.defaultlang.next(lng);
    localStorage.setItem('lang', JSON.stringify(lng));
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.subscription == '') {
      this.error_msg = 'Email is required';
      return;
    }
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!this.subscription.match(mailformat)) {
      this.error_msg = 'Email must be a valid email address';
      return
    }
    this.error_msg = '';
    let data = {
      email: this.subscription
    }
    this.ApiService.subscriptionemail(data).subscribe(result => {
      if (result.status === 0) {
        this.errorsmsg(result.response);
      } else {
        this.successmsg('Successfull subscribed');
      }
    });
  }
  pagesfun(slug) {
   let page = this.pages.filter(x=>x.slug == slug);
   if(page && page.length > 0 && (page[0].name == 'Contact Us' || page[0].category == 'INFORMATIONS')){
    this.router.navigate(['/contactus']);
   }else{
     this.router.navigate(['/page', slug]);
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
  //lang
  setLang(lang: string) {
    let lng = this.Languages.filter(x => x.code === lang)[0];
    localStorage.setItem('lang', JSON.stringify(lng));
    this.store.defaultlang.next(lang);
    this.translate.use(lang);
    window.scrollTo(0, 0);
    this.elementRef.nativeElement.querySelector('.handy-home-footer').click();
  }
}

