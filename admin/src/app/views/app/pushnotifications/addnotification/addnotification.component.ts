import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Apiconfig, AdminService } from "../../../../_services";
import { FormGroup, FormControl,NgForm } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { environment } from "src/environments/environment";
import { $ } from 'protractor';


@Component({
  selector: 'app-addnotification',
  templateUrl: './addnotification.component.html',
  styleUrls: ['./addnotification.component.scss']
})
export class AddnotificationComponent implements OnInit {

  @ViewChild('form') form: NgForm;
  title: string;
  typeOfNotification: any;
  buttonDisabled = false;
  buttonState = '';
  emailContentData = '';
  spinner = 'none';

  constructor(
    private AdminService: AdminService,
    private notifications: NotificationsService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.showspinner();
    const id = this.ActivatedRoute.snapshot.paramMap.get('id');
    if(id){
      this.hidespinner();
      this.title = "Edit";
      this.AdminService.CommonApi('post', Apiconfig.Pushnotificationtemplateedit, {id:id}).subscribe(
        (result) => {
          if(result.status == 1){
           this.typeOfNotification = result.response.notificationtype;
            this.form.form.controls['templet_id'].setValue(result.response._id);
            this.form.form.controls['notificationType'].setValue(result.response.notificationtype);
            if(result.response.notificationtype == 'email'){
              setTimeout(() => {
                this.form.form.controls['templateTitle'].setValue(result.response.name);
                this.form.form.controls['emailSubject'].setValue(result.response.subject);
                this.form.form.controls['senderName'].setValue(result.response.sender_name);
                this.form.form.controls['senderemail'].setValue(result.response.sender_email);
                this.form.form.controls['emailContent'].setValue(result.response.content);
              }, 500);
            }else{
              setTimeout(() => {
                this.form.form.controls['messagetitle'].setValue(result.response.name);
                this.form.form.controls['messagesubject'].setValue(result.response.subject);
                this.form.form.controls['messagecontent'].setValue(result.response.content);
              }, 500);
              
            }
          }
        }, (error) => {
          this.buttonDisabled = false;
          this.buttonState = '';
          this.notifications.create('Error', error.message, NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
        })
    }else{
      this.hidespinner();
      this.title = "Add New";
      this.typeOfNotification;
    }
  }

  typeChange(){
    this.typeOfNotification = this.form.form.get('notificationType').value;
  }

  onSubmit(){
    this.showspinner();
    if (this.form.form.valid) {
      this.hidespinner();
      var data = {};
      if(this.form.form.get('notificationType').value == 'email'){
         data = {
          '_id':this.form.form.get('templet_id').value,
          'name':this.form.form.get('templateTitle').value,
          'subject':this.form.form.get('emailSubject').value,
          'sender_name':this.form.form.get('senderName').value,
          'sender_email':this.form.form.get('senderemail').value,
          'content':this.form.form.get('emailContent').value,
          'notificationtype':this.form.form.get('notificationType').value
        };
      }else{
         data = {
          '_id':this.form.form.get('templet_id').value,
          'name':this.form.form.get('messagetitle').value,
          'subject':this.form.form.get('messagesubject').value,
          'content':this.form.form.get('messagecontent').value,
          'notificationtype':this.form.form.get('notificationType').value
        };

      }
      

      this.AdminService.CommonApi('post', Apiconfig.Pushnotificationtemplatesave, data).subscribe(
        (data) => {
          this.buttonDisabled = false;
          this.buttonState = '';
          if(data){
            if(data.status == 1 ){
              this.buttonDisabled = false;
              this.buttonState = 'show-spinner';
              this.notifications.create('Success', data.message, NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });

              setTimeout(() => {
                this.router.navigate(['/app/pushnotifications/templates']);
              }, 1000);
            }else{
              this.buttonDisabled = false;
              this.buttonState = '';
              this.notifications.create('Error', data.message, NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
            }
          }
        }, (error) => {
          this.buttonDisabled = false;
          this.buttonState = '';
          this.notifications.create('Error', error.message, NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
        })
    }
    else {
      this.hidespinner();
      this.buttonDisabled = false;
      this.buttonState = '';
      this.notifications.create('Error', 'Please Enter all mandatory fields', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
    }
  }
  showspinner() {
    this.spinner = 'block'
  }
  hidespinner() {
    this.spinner = 'none';
  }
}
