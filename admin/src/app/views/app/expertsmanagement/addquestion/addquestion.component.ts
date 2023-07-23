import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Apiconfig, AdminService } from "../../../../_services";
import { FormGroup, FormControl,NgForm } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-addquestion',
  templateUrl: './addquestion.component.html',
  styleUrls: ['./addquestion.component.scss']
})
export class AddquestionComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  buttonDisabled = false;
  buttonState = '';
  spinner = 'none';
  constructor(
    private AdminService: AdminService,
    private notifications: NotificationsService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute
  ) {
  
   }
   title ="";

   ngOnInit() {
     this.showspinner();
    const id = this.ActivatedRoute.snapshot.paramMap.get('id');
    if(id){
      this.hidespinner();
      this.title = "Edit";
      this.AdminService.CommonApi('post', Apiconfig.questionedit, {id:id}).subscribe(
        (result) => {
          if(result){
            if(result.status ==1){
              this.form.form.controls['question_id'].setValue(result.response._id);
                this.form.form.controls['question'].setValue(result.response.question);
                this.form.form.controls['status'].setValue(result.response.status+'');
            
            }else{
             return;
            }
            
          }
        }, (error) => {
          console.log(error);
        })
    }else{
      this.hidespinner();
      this.title = "Add New";
    }

  }

  onSubmit() {
    this.showspinner();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    
    if (this.form.form.valid) {
      this.hidespinner();
      var data = {
        '_id':this.form.form.get('question_id').value,
        'question':this.form.form.get('question').value,
        'status':this.form.form.get('status').value
      };

      this.AdminService.CommonApi('post', Apiconfig.questionsave, data).subscribe(
        (data) => {
          if(data){
            if(data.status == 1 ){
              this.buttonDisabled = false;
              this.buttonState = 'show-spinner';
              this.notifications.create('Success', data.message, NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
              this.hidespinner();
              setTimeout(() => {
                this.router.navigate(['/app/expertsmanagement/questionslist']);
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
