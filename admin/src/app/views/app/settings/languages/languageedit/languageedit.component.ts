import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { AdminService, Apiconfig } from "src/app/_services";

@Component({
  selector: 'app-languageedit',
  templateUrl: './languageedit.component.html',
  styleUrls: ['./languageedit.component.scss']
})
export class LanguageeditComponent implements OnInit {

  @ViewChild('form') form: NgForm;
  buttonDisabled = false;
  buttonState = '';
  editid: any;
  languageeditdata: any;
  title: String;
  spinner = 'none';

  constructor(
    private AdminService: AdminService,
    private notifications: NotificationsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.showspinner();
    this.editid = this.route.snapshot.paramMap.get('id');
    if (this.editid) {
      this.title = "Edit"
      this.AdminService.CommonApi('post', Apiconfig.languageedit, { id: this.editid }).subscribe(
        (results) => {
          if (results.status == 1) {
            this.hidespinner();
            this.languageeditdata = results.response;
            this.form.form.controls['name'].setValue(this.languageeditdata.name);
            this.form.form.controls['code'].setValue(this.languageeditdata.code);
            this.form.form.controls['status'].setValue(this.languageeditdata.status+'');
          }
        })
    }else{
      this.hidespinner();
      this.title = "Add"
    }
  }
  onSubmit() {
    this.showspinner();
    let languageediteddata = this.form.form.value;
    languageediteddata._id = this.editid;
    languageediteddata.default = languageediteddata.default ? this.languageeditdata.default : 0;
    if (this.form.form.valid) {
      this.AdminService.CommonApi('post', Apiconfig.languagesave, languageediteddata).subscribe(
        (data) => {
          if (data.status == 1) {
            this.hidespinner();
            this.buttonDisabled = false;
            this.buttonState = 'show-spinner';
            this.notifications.create('Success', 'Language Saved Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
            this.ngOnInit();
            setTimeout(() => {
              this.router.navigate(['app/settings/languages/languagelist']);
            }, 1000);
          }else{
            this.notifications.create('Error', data.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
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
