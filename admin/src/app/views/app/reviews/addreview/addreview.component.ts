import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Apiconfig, AdminService } from "../../../../_services";
import { FormGroup, FormControl,NgForm } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { DatePipe } from '@angular/common';
import { $ } from 'protractor';

@Component({
  selector: 'app-addreview',
  templateUrl: './addreview.component.html',
  styleUrls: ['./addreview.component.scss']
})
export class AddreviewComponent implements OnInit {

  @ViewChild('form') form: NgForm;
  buttonDisabled = false;
  buttonState = '';
  spinner = 'none';

  constructor(
    private AdminService: AdminService,
    private notifications: NotificationsService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute
  ) { }
  ratting:number;
  booking_id:String;
  task : String;
  status: number;
  username: String;
  userphone: String;
  useremail: String;
  taskername: String;
  taskerphone: String;
  taskeremail: String;
  reviewed_date: String;
  reviewed_by: String;
  comments: String;


  ngOnInit() {
    this.showspinner();
    const id = this.ActivatedRoute.snapshot.paramMap.get('id');
   
          this.AdminService.CommonApi('post', Apiconfig.reviewedit, {id:id}).subscribe(
            (result) => {
              if(result){
                this.hidespinner();
               this.ratting = result.response[0].rating;
               this.status = result.response[0].task.status;
               this.task = result.response[0].task.category.name;
               this.booking_id = result.response[0].task.booking_id;
               this.username = result.response[0].user.username;
               this.userphone = result.response[0].user.phone.code+'-'+result.response[0].user.phone.number;
               this.useremail = result.response[0].user.email;
               this.taskername = result.response[0].tasker.username;
               this.taskerphone = result.response[0].tasker.phone.code+'-'+result.response[0].tasker.phone.number;
               this.taskeremail = result.response[0].tasker.email;
               this.reviewed_date =  new DatePipe('en-US').transform(result.response[0].createdAt, 'MMM dd, yyyy');
               this.reviewed_by = result.response[0].type;
               this.comments = result.response[0].comments;
               //this.form.form.controls['comments'].setValue(result.response[0].comments);
               this.form.form.controls['review_id'].setValue(result.response[0]._id);
              }
            }, (error) => {
              console.log(error);
              this.hidespinner();
            })
  }

  onSubmit() {
    this.showspinner();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';

    if (this.form.form.valid) {
      
      var data = {
        '_id':this.form.form.get('review_id').value
      };
      if(this.form.form.get('comments').value != ""){
        data['comments'] = this.form.form.get('comments').value;
      }else{
        data['comments'] = this.comments;
      }
      
      
      this.AdminService.CommonApi('post', Apiconfig.reviewsave, data).subscribe(
        (data) => {
          this.hidespinner();
          this.buttonDisabled = false;
          this.buttonState = '';
          if(data){
            if(data.status == 1 ){
              
              this.buttonDisabled = false;
              this.buttonState = '';
              this.notifications.create('Success', data.message, NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
              this.hidespinner();
              setTimeout(() => {
                this.router.navigate(['/app/reviews/list']);
              }, 1000);
            }else{
              this.buttonDisabled = false;
              this.buttonState = '';
              this.notifications.create('Error', data.response, NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
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
      this.notifications.create('Error', 'Please Enter mandatory field', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
    }
  }
  showspinner() {
    this.spinner = 'block'
  }
  hidespinner() {
    this.spinner = 'none';
  }
}
