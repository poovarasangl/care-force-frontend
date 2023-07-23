import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubCategoryService } from './sub-category.service';
import { AlertService } from '../../alert/alert.service';
import { CONFIG } from '../../config';
import { SpinnerService } from '../../spinner/spinner.service';


@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.sass']
})
export class SubCategoryComponent implements OnInit {
  categories: any;
  imageUrl = CONFIG.imageUrl;

  constructor(
    private route: ActivatedRoute,
    private ApiService: SubCategoryService,
    private toastr: AlertService,
    private router: Router,
    private spinner: SpinnerService, ) { }

  ngOnInit() {
    const data = {
      slug: this.route.snapshot.paramMap.get('slug')
    }
    this.ApiService.SubcategoryData(data).subscribe(result => {
      if (result.status == 0) {
        this.errorsmsg(result.response);
      } else {
        this.categories = result.response;
      }
    })
  }

  taskassign(slugname) {
    let category = {
      maincategory: this.route.snapshot.paramMap.get('slug'),
      subcategory: slugname,
      expiresAt : new Date().getTime()
    }
    localStorage.removeItem('jobdetailsdata');
    localStorage.setItem('selectedcategory', JSON.stringify(category));

    const data = {
      slug: slugname
    }
    this.ApiService.Gettaskerdetails(data).subscribe(result => {
      if (result.status == 0 || !result.response.filtersInit) {
        this.errorsmsg('Service is not available!.');
      } else {
        localStorage.setItem('category_filter', JSON.stringify(result.response));
        this.router.navigate(['/task']);
      }
    })
  }
  homepage(){
    this.router.navigate(['']);
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
