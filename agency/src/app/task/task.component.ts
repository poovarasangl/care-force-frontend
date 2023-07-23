import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskService } from './task.service';
import { StoreService } from '../store/store.service';
import { AlertService } from '../alert/alert.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.sass']
})
export class TaskComponent implements OnInit {
  jobdetails = true;
  viewexperts = false;
  type = 'slug';
  viewexpertstab = 'none';
  title = 'testing';
  constructor(
    private router: Router,
    private ApiService: TaskService,
    private route: ActivatedRoute,
    private store: StoreService,
    private toastr: AlertService) {
  }

  ngOnInit() {
    if (localStorage.getItem('selectedcategory')) {
      let slugname = JSON.parse(localStorage.getItem('selectedcategory'));
      if (slugname.expiresAt + 86400000 > new Date().getTime()) {
        this.type = slugname.subcategory;
        if (localStorage.getItem('seletedtabtask') === 'veiw-experts') {
          this.jobdetails = false;
          this.viewexpertstab = 'auto';
          this.viewexperts = true;
          this.router.navigate(['/task/view-experts', this.type]);
        } else {
          this.router.navigate(['/task/job-details', this.type]);
        }
      } else {
        localStorage.removeItem('selectedcategory');
        this.router.navigate(['']);
      }
    } else {
      localStorage.removeItem('selectedcategory');
      this.router.navigate(['']);
    }
  }
  jobdetailsfun() {
    this.router.navigate(['/task/job-details', this.type]);
  }
  viewexpertsfun() {
    this.router.navigate(['/task/view-experts', this.type]);
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
}
