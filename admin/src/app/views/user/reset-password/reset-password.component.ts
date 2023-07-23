import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService, Apiconfig } from 'src/app/_services';
import { MustMatch } from 'src/app/containers/form-validations/custom.validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  emailModel = '';
  passwordModel = '';
  editid = '';
  buttonDisabled = false;
  buttonState = '';
  mustmatch: boolean = false;
  resetForm: FormGroup;
  submitted = false;

  constructor(
    private authService: AdminService,
    private route: ActivatedRoute,
    private notifications: NotificationsService,
    private router: Router,
    private formBuilder: FormBuilder) {
    this.editid = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }
  get form() { return this.resetForm.controls; }
  onSubmit() {
    this.submitted = true;
    if (!this.resetForm.valid || this.buttonDisabled) {
      return;
    }
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    let saveData = {
      userid: this.editid,
      password: this.resetForm.value.password
    }
    this.authService.CommonApi('post', Apiconfig.saveforgotpassword, saveData).subscribe(
      (result) => {
        if (result.status == 1) {
          this.notifications.create('Done', 'Password reset completed, you will be redirected to Login page!', NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
          this.buttonDisabled = false;
          this.buttonState = '';
          this.submitted = false;
          this.resetForm.reset();
          setTimeout(() => {
            this.router.navigate(['user/login']);
          }, 1000);
        } else {
          this.buttonDisabled = false;
          this.buttonState = '';
          this.notifications.create('Error', result.response, NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
        }
      }, (error) => {
        this.buttonDisabled = false;
        this.buttonState = '';
        this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
      });
  }
}