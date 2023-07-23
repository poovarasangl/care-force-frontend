import { Component, OnInit, ElementRef } from '@angular/core';
import { MainCategoryService } from './main-category.service';
import { AlertService } from '../../alert/alert.service';
import { CONFIG } from '../../config';
import { Router } from '@angular/router';
import { SpinnerService } from '../../spinner/spinner.service';

@Component({
  selector: 'app-main-category',
  templateUrl: './main-category.component.html',
  styleUrls: ['./main-category.component.sass']
})
export class MainCategoryComponent implements OnInit {
  categories: any;
  imageUrl = CONFIG.imageUrl;
  loader:boolean = true;
  constructor(
    private ApiService: MainCategoryService,
    private toastr: AlertService,
    private router: Router,
    private spinner: SpinnerService,
    private elementRef: ElementRef,) {
      // let header = document.getElementsByTagName('app-main-header')[0];
      // header.classList.remove('')
      // console.log(document.getElementsByTagName('app-main-header')[0]);      
    }

  ngOnInit() {
    this.ApiService.CategoryData().subscribe(result => {
      //this.loader = false;
      if(result.status == 0){
        this.errorsmsg(result.response);
      }else{
        this.categories = result.response;
      }
    })
  }
  subcategory(slug){
    this.router.navigate(['/sub-category',slug]);
  }
  homepage(){
    this.router.navigate(['']);
  }

  successmsg(msg) {
    setTimeout(() => {
      this.toastr.clear();
    },2000);
    this.toastr.success(msg);
  }
  errorsmsg(msg) {
    setTimeout(() => {
      this.toastr.clear();
    },2000);
    this.toastr.error(msg);
  }
  warningmsg(msg) {
    setTimeout(() => {
      this.toastr.clear();
    },2000);
    this.toastr.warn(msg);
  }
  showspinner() {
    this.spinner.Spinner('show');
  }
  hidespinner() {
    this.spinner.Spinner('hide');
  }
}
