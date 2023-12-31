import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AdminService, Apiconfig } from 'src/app/_services';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent implements OnInit {
	@ViewChild('passwordForm') passwordForm: NgForm;
	buttonDisabled = false;
	buttonState = '';

	constructor(
		private authService: AdminService,
		private notifications: NotificationsService,
		private router: Router) { }

	ngOnInit() {
	}

	onSubmit() {
		if (!this.passwordForm.valid || this.buttonDisabled) {
			return;
		}
		this.buttonDisabled = true;
		this.buttonState = 'show-spinner';

		this.authService.CommonApi('post', Apiconfig.forgotpassword, this.passwordForm.value).subscribe(
			(answer) => {
				this.notifications.create('Done', 'Password reset email is sent, you will be redirected to Reset Password page!', NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
				this.buttonDisabled = false;
				this.buttonState = '';
				setTimeout(() => {
					this.router.navigate(['user/login']);
				}, 6000);
			}, (error) => {
				this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
				this.buttonDisabled = false;
				this.buttonState = '';
			});
	}

}
