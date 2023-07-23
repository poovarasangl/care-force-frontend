import privilagedata, { PrivilagesData } from 'src/app/constants/privilages';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Apiconfig, AdminService } from "../../../../_services";
import { FormGroup, FormControl, NgForm, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from "src/environments/environment";
import { MustMatch } from 'src/app/containers/form-validations/custom.validators';


@Component({
  selector: 'app-subadminedit',
  templateUrl: './subadminedit.component.html',
  styleUrls: ['./subadminedit.component.scss']
})
export class SubadmineditComponent implements OnInit {
  privilagesdata: PrivilagesData[] = privilagedata;
  buttonDisabled = false;
  buttonState = '';
  editid: any;
  title = ""
  spinner: string = 'none';
  subadminEdit: any;
  subadminForm: FormGroup;
  submitted = false;

  constructor(
    private AdminService: AdminService,
    private notifications: NotificationsService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.subadminForm = this.formBuilder.group({
      _id: [],
      username: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [],
      confirmPassword: []
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });

    this.editid = this.route.snapshot.paramMap.get('id');
    if (this.editid) {
      this.title = 'EDIT';
    } else {
      this.title = 'ADD'
    }
  }

  get forms() { return this.subadminForm.controls; }


  ngOnInit() {
    this.showspinner();
    if (this.editid) {
      this.AdminService.CommonApi('post', Apiconfig.subadminedit, { id: this.editid }).subscribe(
        (result) => {
          this.hidespinner();
          if (result.status == 1) {
            this.subadminEdit = result.response;
            this.subadminForm.controls['_id'].setValue(this.editid);
            this.subadminForm.controls['username'].setValue(this.subadminEdit.username);
            this.subadminForm.controls['name'].setValue(this.subadminEdit.name);
            this.subadminForm.controls['email'].setValue(this.subadminEdit.email);
            this.privilagesdata.forEach((value) => { 
              let index = this.subadminEdit.privileges.findIndex(x=>x.alias == value.alias);
              value.status = this.subadminEdit.privileges[index].status;
            })         
          }
        }
      ), (error) => {
        this.hidespinner();
        console.log(error);
      }
    }
  }
  selectall(event) {
    this.privilagesdata.forEach((value) => {
      value.status.add = event;
      value.status.edit = event;
      value.status.view = event;
      value.status.delete = event;
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.subadminForm.invalid) {
      return;
    }
  }
  showspinner() {
    this.spinner = 'block'
  }
  hidespinner() {
    this.spinner = 'none';
  }

}
