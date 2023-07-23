import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { AdminService, Apiconfig } from "src/app/_services";

@Component({
  selector: 'app-cancellationedit',
  templateUrl: './cancellationedit.component.html',
  styleUrls: ['./cancellationedit.component.scss']
})
export class CancellationeditComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  buttonDisabled = false;
  buttonState = '';
  editid: any;
  canceleditdata: any;
  spinner = 'none';

  constructor(private AdminService: AdminService,
    private notifications: NotificationsService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.showspinner();
    this.editid = this.route.snapshot.paramMap.get('id');
    if (this.editid) {
      this.hidespinner();
      this.AdminService.CommonApi('post', Apiconfig.canceledit, { id: this.editid }).subscribe(
        (results) => {
          if (results.status == 1) {
            this.canceleditdata = results.response;
            this.form.form.controls['reason'].setValue(this.canceleditdata.reason);
            this.form.form.controls['type'].setValue(this.canceleditdata.type);
            this.form.form.controls['status'].setValue(this.canceleditdata.status+'');
          }
        })
    } else {
      this.hidespinner();
    }
  }
  onSubmit() {
    this.showspinner();
    let cancelediteddata = this.form.form.value;
    cancelediteddata._id = this.editid;
    if (this.form.form.valid) {
      this.AdminService.CommonApi('post', Apiconfig.cancelsave, cancelediteddata).subscribe(
        (data) => {
          this.hidespinner();
          if (data.status == 1) {
            this.buttonDisabled = false;
            this.buttonState = 'show-spinner';
            this.notifications.create('Success', 'Cancellation reason Saved Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
            this.ngOnInit();
            setTimeout(() => {
              this.router.navigate(['/app/settings/cancellation/cancellationlist']);
            }, 1000);
          }
        }, (error) => {
          this.notifications.create('Error', error.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
        })
    } else {
      this.hidespinner();
      this.notifications.create('Error', 'Please enter all madatory fields', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
    }
  }
  showspinner() {
    this.spinner = 'block'
  }
  hidespinner() {
    this.spinner = 'none';
  }
}
