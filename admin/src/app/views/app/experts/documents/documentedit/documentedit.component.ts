import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { AdminService, Apiconfig } from "src/app/_services";

@Component({
  selector: 'app-documentedit',
  templateUrl: './documentedit.component.html',
  styleUrls: ['./documentedit.component.scss']
})
export class DocumenteditComponent implements OnInit {

  @ViewChild('form') form: NgForm;
  buttonDisabled = false;
  buttonState = '';
  editid: any;
  languageeditdata: any;
  documenteditdata: any;

  constructor(
    private AdminService: AdminService,
    private notifications: NotificationsService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.editid = this.route.snapshot.paramMap.get('id');
    if (this.editid) {
      this.AdminService.CommonApi('post', Apiconfig.documentedit, { id: this.editid }).subscribe(
        (results) => {
          if (results.status == 1) {
            this.documenteditdata = results.response;
            this.form.form.controls['name'].setValue(this.documenteditdata.name);
            this.form.form.controls['mandatory'].setValue(this.documenteditdata.mandatory+'');
            this.form.form.controls['status'].setValue(this.documenteditdata.status+'');
          }
        })
    }

  }
  onSubmit() {
    let documentediteddata = this.form.form.value;
    if(this.documenteditdata){
      documentediteddata._id = this.documenteditdata._id;
      documentediteddata.replace_name = this.documenteditdata.name;
    }
    if (this.form.form.valid) {
      console.log(documentediteddata);
      this.AdminService.CommonApi('post', Apiconfig.documentsave, documentediteddata).subscribe(
        (data) => {
          if (data.status == 1) {
            this.buttonDisabled = false;
            this.buttonState = 'show-spinner';
            this.notifications.create('Success', 'Documents Saved Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
            this.ngOnInit();
            setTimeout(() => {
              this.router.navigate(['app/experts/document/documentlist']);
            }, 1000);
          }else{
            this.notifications.create('Error', data.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
          }
        }, (error) => {
          this.notifications.create('Error', error.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
        })
    } else {
      this.notifications.create('Error', 'Please enter all madatory fields', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
    }
  }

}
