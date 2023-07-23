import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, HostListener, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from './home.service';
import { StoreService } from '../store/store.service';
import { AlertService } from '../alert/alert.service';
import { SpinnerService } from '../spinner/spinner.service';
import { CONFIG } from '../config';
import { isArray } from 'util';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// import * as jQuery from '../../assets/Jquery3.4.1/jquery.min.js'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  Category: any;
  Subcategory: any;
  postheader: any;
  peoplecmd: any;
  posttasks: any;
  categories: any;
  currentuser: any;
  Categorysearch = 0;
  currentDate: any;
  imageUrl = CONFIG.imageUrl;
  itemsPerSlide = 3;
  singleSlideOffset = true;
  noWrap = true;
  showIndicator = false;
  routerurl: string;
  maincategoryvalue: string = '';
  subcategoryvalue: string = '';
  carousel_condent: string = '';
  carousel_page: number = 0;
  previousbtn: boolean = true;
  nextbtn: boolean = false;
  appearance: any;
  homePage_baner_url: SafeResourceUrl;
  subcategorylist: any
  @ViewChild('subcat') subcat: ElementRef;
  @HostListener('click')
  clickInside() {
    this.store.sidebar.next(false);
  }
  constructor(
    private homeService: HomeService,
    private store: StoreService,
    private router: Router,
    private toastr: AlertService,
    private elementRef: ElementRef,
    private spinner: SpinnerService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef) {
    this.routerurl = this.router.url;
    this.store.Url.next(this.routerurl);
    this.currentuser = JSON.parse(localStorage.getItem('currentuser'));
  }

  ngOnChanges(): void {

    // $("#banner").css({ "height": h });

    // $(window).resize(function () {
    //   var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    //   $("#banner").css({ "height": h });
    // });

    // setTimeout(function () {
    //   $('.jarallax').jarallax({
    //     speed: 0.2
    //   });
    // }, 10);    
  }
  ngAfterViewInit() {
    // var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    // (document.querySelector('#banner') as HTMLElement).style.height = '270px';
  }

  ngOnInit() {
    localStorage.removeItem('cat_id')
    let keysToRemove = ["selectedcategory", "seletedtabtask", "Taskassign", "showtab"];
    for (let key of keysToRemove) {
      localStorage.removeItem(key);
    }
    this.hidespinner();
    this.currentuser = JSON.parse(localStorage.getItem('currentuser'));
    this.currentDate = new Date().getTime();
    if (this.currentuser) {
      if (this.currentuser.user_type == 'user') {
        this.Categorysearch = 1;
      } else {
        this.Categorysearch = 0;
      }
    } else {
      this.Categorysearch = 1;
    }

    this.store.landingdata.subscribe((result: any) => {
      this.Category = result.categories;
      console.log(this.Category);
      
      this.postheader = result.postheader;
      this.peoplecmd = result.peoplecmd;
      this.posttasks = result.posttask;
      this.categories = result.categories;
      if (result.appearance) {
        this.appearance = result.appearance.filter(x => x.imagefor == 'bannerpage').length > 0 ? result.appearance.filter(x => x.imagefor == 'bannerpage')[0] : {};
      }
      this.elementRef.nativeElement.querySelector('.home-container').click();
    });
    this.store.defaultlang.subscribe((data: string) => {
      if (data != '') {
        setTimeout(() => {
          this.elementRef.nativeElement.querySelector('.home-container').click();
        }, 1000);
      }
    })
    let subCat = {
      "skip": 0,
      "limit": 10
    }
    this.homeService.subCategorylist(subCat).subscribe(res => {
      if (res.status == 1) {
        this.subcategorylist = res.response
        console.log(this.subcategorylist);

      }
    })
    this.cd.detectChanges();
  }
  Categorychange(event) {
    console.log(event.target.value);

    const data = {
      slug: event.target.value
    };
    this.maincategoryvalue = event.target.value;

    // this.homeService.Getsubcategory(data).subscribe(result => {
    //   if (result.status === 1) {
    //     this.subcat.nativeElement.value = '';
    //     this.Subcategory = result.response;
    //     this.elementRef.nativeElement.querySelector('.home-container').click();
    //     setTimeout(() => {
    //       this.hidespinner();
    //     }, 1000);
    //   }
    // });
  }
  Subcategorychange(event) {
    this.subcategoryvalue = event.target.value;
  }

  onSubmit() {
    if(this.currentuser){

      this.router.navigate(['jobdetails'])
    } else{
      this.router.navigate(['login'])
    }
    // if (this.maincategoryvalue === '') {
    //   this.errorsmsg('Please choose a category!!.');
    //   return;
    // }
    // localStorage.setItem('cat_id',this.maincategoryvalue)
    //  this.router.navigate(['/task/job-details',this.maincategoryvalue]);
    // let category = {
    //   maincategory: this.maincategoryvalue,
    //   subcategory: this.subcategoryvalue,
    //   expiresAt: new Date().getTime()
    // }
    // this.showspinner();
    // localStorage.removeItem('jobdetailsdata');
    // localStorage.setItem('selectedcategory', JSON.stringify(category));

    // const data = {
    //   slug: category.subcategory
    // }
    // this.homeService.Gettaskerdetails(data).subscribe(result => {
    //   if (result.status == 0 || !result.response.filtersInit) {
    //     this.hidespinner();
    //     this.errorsmsg('Service is not available!.');
    //   } else {
    //     this.hidespinner();
    //     localStorage.setItem('category_filter', JSON.stringify(result.response));
    //     this.router.navigate(['/task/job-details', category.subcategory]);
    //     // this.router.navigate(['/task']);
    //   }
    // })
  }

  Cat_language(item, type) {
    if (type == 'Category') {
      if (typeof item.category_language != 'undefined' && isArray(item.category_language)) {
        if (localStorage.getItem('lang')) {
          var val = item.category_language.filter(x => x.lang_code == JSON.parse(localStorage.getItem('lang')).code)[0];
        }
        return val ? val.cate_name : item.cate_name;
      } else {
        return item.name;
      }
    } else if (type == 'postheader-title') {
      if (typeof item.postHeader != 'undefined' && isArray(item.postHeader)) {
        if (localStorage.getItem('lang')) {
          var val = item.postHeader.filter(x => x.lang_code == JSON.parse(localStorage.getItem('lang')).code)[0];
        }
        return val ? val.title : item.title;
      } else {
        return item.title;
      }
    } else if (type == 'postheader-description') {
      if (typeof item.postHeader != 'undefined' && isArray(item.postHeader)) {
        if (localStorage.getItem('lang')) {
          var val = item.postHeader.filter(x => x.lang_code == JSON.parse(localStorage.getItem('lang')).code)[0];
        }
        return val ? val.description : item.description;
      } else {
        return item.description;
      }
    } else if (type == 'posttask-name') {
      if (typeof item.postTask != 'undefined' && isArray(item.postTask)) {
        if (localStorage.getItem('lang')) {
          var val = item.postTask.filter(x => x.lang_code == JSON.parse(localStorage.getItem('lang')).code)[0];
        }
        return val ? val.name : item.name;
      } else {
        return item.name;
      }
    } else if (type == 'posttask-description') {
      if (typeof item.postTask != 'undefined' && isArray(item.postTask)) {
        if (localStorage.getItem('lang')) {
          var val = item.postTask.filter(x => x.lang_code == JSON.parse(localStorage.getItem('lang')).code)[0];
        }
        return val ? val.description : item.description;
      } else {
        return item.description;
      }
    }
    // else if(type == 'categories-name'){
    //   if(typeof item.category_language !='undefined' && isArray(item.category_language)){
    //     let val = item.category_language.filter(x=>x.lang_code == JSON.parse(localStorage.getItem('lang')).code)[0];
    //     return val ? val.name : item.name;
    //   }else{
    //     return item.name;
    //   }
    // }
  }

  maincategory() {
    this.router.navigate(['/main-category']);
  }
  subcategory(slug) {
    this.router.navigate(['/sub-category', slug]);
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
  jobDetailpage(data){
    this.router.navigate(['jobdetails'])

  }
}
