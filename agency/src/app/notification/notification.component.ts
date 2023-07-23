import { Component, OnInit } from '@angular/core';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';
import { SpinnerService } from '../spinner/spinner.service';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.sass']
})
export class NotificationComponent implements OnInit {
  currentuser: any;
  skip: number = 0;
  limit: number = 3;
  notificationlist: any;
  currentpage: number = 1;
  count = 0;

  constructor(private ApiService: NotificationService,
    private router: Router,
    private spinner: SpinnerService,) {
    this.currentuser = JSON.parse(localStorage.getItem('currentuser'));
  }

  ngOnInit() {
    localStorage.removeItem("notificationdata");
    let data = {
      user: this.currentuser.user_id,
      type: this.currentuser.user_type,
      skip: this.skip,
      limit: this.limit
    }
    this.ApiService.getnotificationlist(data).subscribe((result: any) => {
      this.hidespinner();
      if (result.status === 1) {
        if (result.response.length) {
          this.notificationlist = result.response;
          this.count = result.response[0].count;
        }
      }
    });
  }

  pagechange(event) {
    if (this.currentpage != event) {
      this.currentpage = event;
      let data = {
        user: this.currentuser.user_id,
        type: this.currentuser.user_type,
        skip: this.limit * (this.currentpage - 1),
        limit: this.limit * this.currentpage,
      }
      this.ApiService.getnotificationlist(data).subscribe((result: any) => {
        this.hidespinner();
        if (result.status === 1) {
          if (result.response.length) {
            this.notificationlist = result.response;
          }
        }
      });
    }
  }

  jobdetails(item) {
    this.showspinner();
    localStorage.setItem('showtab', 'Detailstab');
    localStorage.setItem('notificationdata', JSON.stringify(item));
    this.router.navigate(['/account/job-details']);
  }
  showspinner() {
    this.spinner.Spinner('show');
  }
  hidespinner() {
    this.spinner.Spinner('hide');
  }
}
// /getnotificationlist