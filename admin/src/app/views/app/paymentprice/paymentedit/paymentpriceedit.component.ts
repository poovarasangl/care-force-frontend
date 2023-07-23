import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AdminService, Apiconfig } from "../../../../_services";
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationType, NotificationsService } from 'angular2-notifications';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-paymentpriceedit',
  templateUrl: './paymentpriceedit.component.html',
  styleUrls: ['./paymentpriceedit.component.scss']
})
export class PaymentpriceeditComponent implements OnInit {

  @ViewChild('form') form: NgForm;
	title: String;
	editid: string;
	buttonDisabled = false;
	buttonState = '';
	ppSaveData = new FormData();
	imagepreview = {
		image: '' as string | ArrayBuffer,
		icon: '' as string | ArrayBuffer,
		activeicon: '' as string | ArrayBuffer
	}
	paymentPriceData: any;
	imageUrl: string = environment.apiUrl;
	spinner = 'none';

	constructor(
		private apiService: AdminService, 
		private router: Router,
		private ActivatedRoute: ActivatedRoute, 
		private notifications: NotificationsService
		) { }

	ngOnInit(): void {
		this.showspinner();
		this.editid = this.ActivatedRoute.snapshot.paramMap.get('id');
		if (this.editid) {
			this.hidespinner();
			this.title = 'Edit';
			this.apiService.CommonApi('post', Apiconfig.paymentPriceEdit, { id: this.editid }).subscribe(result => {
				if (result.status == 1) {
					this.paymentPriceData = result.response;
						this.form.form.controls['name'].setValue(this.paymentPriceData.name);
						this.form.form.controls['description'].setValue(this.paymentPriceData.description);
						this.form.form.controls['status'].setValue(this.paymentPriceData.status+'');
						this.form.form.controls['image'].setValue(this.paymentPriceData.image);
				}
			});
		} else {
			this.hidespinner();
			this.title = 'Add';
		}
	}

	getFiles(event, key) {
		const imgbytes = event.target.files[0].size;
		const imgtype = event.target.files[0].type;
		this.ppSaveData.delete(key);
		if (imgtype == 'image/jpeg' || imgtype == 'image/png' || imgtype == 'image/gif' || imgtype == 'image/jpg') {
		  if (Math.round(parseInt(imgbytes) / 1024) > 1024) {
			this.notifications.create('Error', 'The uploaded image size must be maximum of 1 MB', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
			this.form.form.controls['image'].setValue('');
			return false;
		  } else {
			this.ppSaveData.append(key, event.target.files[0], event.target.files[0]['name']);
			this.preview(event.target.files[0], key);
		  }
		} else {
		  this.notifications.create('Error', 'Unsupported File Format', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
		  this.form.form.controls['image'].setValue('');
		  return false;
		}
	  }
	  
	preview(files, key) {
		// Show preview
		var mimeType = files.type;
		if (mimeType.match(/image\/*/) == null) {
			return;
		}

		var reader = new FileReader();
		reader.readAsDataURL(files);
		reader.onload = (_event) => {
			this.imagepreview[key] = reader.result;
		}
	}

	onSubmit() {
		this.showspinner();
		this.buttonDisabled = true;
		if (this.form.form.valid){
			this.buttonState = 'show-spinner';
			let payPriceData =   this.form.form.value;
			payPriceData.description = this.form.form.get('description').value;
			payPriceData.image = this.form.form.get('image').value;
			payPriceData.name = this.form.form.get('name').value;
			payPriceData.status = this.form.form.get('status').value;
			payPriceData._id = this.editid;
			delete payPriceData.image;

		this.ppSaveData.append('info', JSON.stringify(payPriceData));	
		this.apiService.CommonApi('post', Apiconfig.paymentPriceSave , this.ppSaveData).subscribe(result =>{
			if(result.status == 1){
				this.hidespinner();
				this.notifications.create('Success', 'Payment Price Added Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
				setTimeout(() => {
					this.buttonDisabled = false;
					this.router.navigate(['app/paymentsprice/list']);	
				}, 1000);
			}
		});
		}else {
			this.hidespinner();
			this.notifications.create('Error', 'Please enter all the madatory fields', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
		}
	}
	showspinner() {
		this.spinner = 'block'
	}
	hidespinner() {
		this.spinner = 'none';
	}
}
