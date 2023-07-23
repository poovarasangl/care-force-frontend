import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../alert/alert.service';
import { AccountService } from '../account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountComponent } from '../account.component';
import { StoreService } from '../../store/store.service';
import { CONFIG } from '../../config';
import { SpinnerService } from '../../spinner/spinner.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.sass'],
	encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {
	currentuser: any;
	profile = {
		username: '',
		email: '',
		_id: '',
		phone: {} as any
	};
	viewpage = 1;
	editpage = 0;
	updateAccountForm: FormGroup;
	imagevalidation: string;
	fileData: File;
	previewUrl: string | ArrayBuffer;
	submitted: boolean;
	verify: string;
	otp: any;
	checkotp: any;
	userprofiledata: FormData;
	resend_btn: number;
	verify_btn: number;
	save_btn: number;
	imageurl = CONFIG.imageUrl;
	mobilelength:string='';
	profile_data:any;
	imageChangedEvent: any;
	profile_img : Blob
	@ViewChild('mobilenumber') mobilenumber: ElementRef;
	constructor(
		private router: Router,
		private toastr: AlertService,
		private Apiservice: AccountService,
		private formBuilder: FormBuilder,
		private ApiService: AccountService,
		private homepage: AccountComponent,
		private store: StoreService,
		private elementRef: ElementRef,
		private spinner: SpinnerService,) {

		this.updateAccountForm = this.formBuilder.group({
			firstname: ['', [Validators.required]],
			lastname: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
			phone: ['', [Validators.required]],
			profile: [''],
			userrole: ['']
		});
	}

	ngOnInit() {
		window.scrollTo(0,0);
		localStorage.setItem('showtab', 'profiletab');
		this.viewpage = 1;
		this.editpage = 0;
		const script1 = document.createElement('script');
		script1.src = 'assets/intel/intlTelInput.js';
		script1.async = false;
		script1.defer = true;
		this.elementRef.nativeElement.appendChild(script1);
		const script2 = document.createElement('script');
		script2.src = 'assets/intel/utils.js';
		script2.async = false;
		script2.defer = true;
		this.elementRef.nativeElement.appendChild(script2);
		const script = document.createElement('script');
		script.src = 'assets/intel/codepen.js';
		script.async = false;
		script.defer = true;
		this.elementRef.nativeElement.appendChild(script);
		this.progilelist();
		this.hidespinner();
	}
	progilelist() {
		this.resend_btn = 0;
		this.verify_btn = 0;
		this.save_btn = 0;
		this.currentuser = JSON.parse(localStorage.getItem('currentuser'));

		const data = {
			userId: this.currentuser.user_id,
			userrole: this.currentuser.user_type
		}
		this.Apiservice.profiledetails(data).subscribe(result => {
			if (result.status === 1) {
				this.Apiservice.Profiledetails.next(result.response[0]);
				this.store.Userdetails.next(result.response[0]);
				this.store.headermsg.next(result.response[0]);
				this.profile = result.response[0];
				this.profile_data = result.response[0];
			} else {
				this.errorsmsg(result.response);
			}
		});
	}

	EditProfileBtn() {
		const script3 = document.createElement('script');
		script3.type = 'text/javascript';
		script3.src = 'assets/intel/intel.js';
		this.elementRef.nativeElement.appendChild(script3);
		this.viewpage = 0;
		this.editpage = 1;
	}
	CancelEditBtn() {
		this.progilelist();
		this.previewUrl = '';
		this.viewpage = 1;
		this.editpage = 0;
	}
	imagechangefun(event) {
		this.showspinner();
		this.imageChangedEvent = event;
		const imgbytes = event.target.files[0].size;
		const imgtype = event.target.files[0].type;
		if (imgtype == 'image/jpeg' || imgtype == 'image/png' || imgtype == 'image/gif' || imgtype == 'image/jpg') {
			if (Math.round(parseInt(imgbytes) / 1024) > 1024) {
				this.imagevalidation = 'red';
				this.hidespinner();
			} else {
				this.imagevalidation = 'black';
				this.fileData = <File>event.target.files[0];
				this.preview();
				this.hidespinner();
			}
		} else {
			this.imagevalidation = 'red';
			this.hidespinner();
		}
	}
	preview() {
		// Show preview
		var mimeType = this.fileData.type;
		if (mimeType.match(/image\/*/) == null) {
			return;
		}

		var reader = new FileReader();
		reader.readAsDataURL(this.fileData);
		reader.onload = (_event) => {
			this.previewUrl = reader.result;
		}
	}

	imageCropped(event: ImageCroppedEvent) {
		this.previewUrl = event.base64;
		this.profile_img = this.b64toBlob(this.previewUrl);
		this.fileData = <File>this.imageChangedEvent.target.files[0];
    }
    imageLoaded() {
        /* show cropper */
    }
    cropperReady() {
        /* cropper ready */
    }
    loadImageFailed() {
        /* show message */
    }
	get f() { return this.updateAccountForm.controls; }

	onSubmit() {
		this.submitted = true;
		let data = {} as any;
		this.save_btn = 1;	
		setTimeout(() => {
		if (this.updateAccountForm.invalid) {
			this.save_btn = 0;
			return;
		}
		this.showspinner();		
		data = this.updateAccountForm.value;
		if(data.phone.number != JSON.parse(this.mobilenumber.nativeElement.value).number){
			if(!JSON.parse(this.mobilenumber.nativeElement.value).valid){
				this.hidespinner();
				this.save_btn = 0;
				this.mobilelength = 'Invalid Mobile Number.';
				return;
			}else{
				this.mobilelength = '';
				data.phone = JSON.parse(this.mobilenumber.nativeElement.value);
			}
		}else{
			this.mobilelength = '';
			data.phone = this.profile_data.phone;
		}
		
		data._id = this.profile._id;
		if (this.currentuser.user_type == 'tasker') {
			data.user_type = "tasker";
		} else {
			data.user_type = "user";
		}
		var formData = new FormData();
		formData.append('file', this.profile_img);
		formData.append('info', JSON.stringify(data));
		// data.profile = this.profile_img;
		this.userprofiledata = formData;
		var number = data.phone.number.replace(/ +/g, "");

		if (this.currentuser.phone === number && JSON.parse(this.mobilenumber.nativeElement.value).valid) {
			this.save_btn = 0;
			this.verifyotp();
		} else if(JSON.parse(this.mobilenumber.nativeElement.value).valid) {
			this.verify = 'block';
			this.ApiService.generateOtp(data).subscribe(result => {
				this.save_btn = 0;
				this.hidespinner();
				this.otp = result.otpkey;
				this.checkotp = result.otpkey;
			});
		}
	}, 2000);
	}

	b64toBlob(dataURI) {
		var byteString = atob(dataURI.split(',')[1]);
		var ab = new ArrayBuffer(byteString.length);
		var ia = new Uint8Array(ab);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ab], { type: 'image/jpeg' });
	}

	closemodal() {
		this.verify = 'none';
	}
	resendotp() {
		this.showspinner();
		this.resend_btn = 1;
		var data = this.updateAccountForm.value;
		this.ApiService.generateOtp(data).subscribe(result => {
			this.hidespinner();
			this.resend_btn = 0;
			this.otp = result.otpkey;
			this.checkotp = result.otpkey;
		});
	}
	verifyotp() {
		this.showspinner();
		this.verify_btn = 1;
		if (this.otp == this.checkotp) {
			this.ApiService.updateprofile(this.userprofiledata).subscribe(result => {
				if (result.status === 0) {
					this.verify = 'none';
					this.verify_btn = 0;
					this.hidespinner();
					this.errorsmsg(result.response);
				} else {
					this.currentuser.phone = this.updateAccountForm.value.phone.number;
					this.currentuser.code = this.updateAccountForm.value.phone.dialCode;
					this.currentuser.firstname = result.response.firstname;
					this.currentuser.lastname = result.response.lastname;
					this.currentuser.username = result.response.username;
										
					this.currentuser.avatar = result.response.avatar ? result.response.avatar : `assets/images/Default/user.jpg`;
					if (result.response.avatar) {
						this.currentuser.avatar = result.response.avatar ? result.response.avatar : `assets/images/Default/user.jpg`;
						// this.store.Useravater.next(this.currentuser);
					}					
					this.store.Userdetails.next(this.currentuser);
					localStorage.setItem('currentuser', JSON.stringify(this.currentuser));
					this.hidespinner();
					// this.homepage.ngOnInit();
					this.ngOnInit();
					this.verify = 'none';
					this.successmsg('Profile successfull updated!!');
					this.elementRef.nativeElement.querySelector('.tskr_prof_dtls').click();
					this.updateAccountForm.reset();
				}
			});
		} else {
			this.hidespinner();
			this.verify_btn = 0;
			this.errorsmsg('Your OTP is invalid');
		}
	}

	successmsg(msg) {
		setTimeout(() => {
			this.toastr.clear();
		}, 2000);
		this.toastr.success(msg);
	}
	errorsmsg(msg) {
		setTimeout(() => {
			this.toastr.clear();
		}, 2000);
		this.toastr.error(msg);
	}
	warningmsg(msg) {
		setTimeout(() => {
			this.toastr.clear();
		}, 2000);
		this.toastr.warn(msg);
	}
	showspinner() {
		this.spinner.Spinner('show');
	  }
	  hidespinner() {
		this.spinner.Spinner('hide');
	  }
}