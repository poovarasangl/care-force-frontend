import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AdminService, Apiconfig } from "src/app/_services";
import { NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-maincategoriesedit',
	templateUrl: './maincategoriesedit.component.html',
	styleUrls: ['./maincategoriesedit.component.scss']
})
export class MaincategorieseditComponent implements OnInit {
	@ViewChild('form') form: NgForm;
	buttonDisabled = false;
	buttonState = '';
	imageUrl: string = environment.apiUrl;
	maincateditdata={}as any;
	maincatsavedata = new FormData();
	prioirtystate: boolean = false;
	editid: any;
	catename_slug: string = '';
	imagepreview = {
		image: '' as string | ArrayBuffer,
		icon: '' as string | ArrayBuffer,
		activeicon: '' as string | ArrayBuffer
	}
	maincatseodetails: any;
	languagelist: any;
	spinner = 'none';
	constructor(private AdminService: AdminService,
		private notifications: NotificationsService,
		private router: Router,
		private route: ActivatedRoute) { }

	ngOnInit(): void {
		this.maincatsavedata = new FormData();
		let data = {
			'skip': 0,
			'limit': 10
		}
		this.AdminService.CommonApi('post', Apiconfig.languagelist, data).subscribe(
			(results: any) => {
				if (results.status === 1) {
					this.languagelist = results.response;
				}
			})
		this.editid = this.route.snapshot.paramMap.get('id');
		if (this.editid) {
			this.showspinner();
			this.AdminService.CommonApi('post', Apiconfig.categoryedit, { id: this.editid }).subscribe(
				(results) => {
					if (results.status == 1) {
						this.hidespinner();
						this.maincateditdata = results.response;
						this.maincatseodetails = results.response.seo;
						this.form.form.controls['name'].setValue(this.maincateditdata.name);
						this.form.form.controls['title'].setValue(this.maincateditdata.title);
						this.form.form.controls['keyword'].setValue(this.maincateditdata.keyword);
						this.form.form.controls['description'].setValue(this.maincateditdata.description);
						this.form.form.controls['status'].setValue(this.maincateditdata.status+'');
						this.maincateditdata.priority = this.maincateditdata.priority ? parseInt(this.maincateditdata.priority) : 0;
						this.prioirtystate = this.maincateditdata.priority == '1' ? true : false;

						// seo details
						this.form.form.controls['title'].setValue(this.maincatseodetails.title);
						this.form.form.controls['keyword'].setValue(this.maincatseodetails.keyword);
						this.form.form.controls['description'].setValue(this.maincatseodetails.description);
					}
				})
		} else {
			this.hidespinner();
		}
	}
	getFiles(event, key) {
		const imgbytes = event.target.files[0].size;
		const imgtype = event.target.files[0].type;
		this.maincatsavedata.delete(key);
		if (imgtype == 'image/jpeg' || imgtype == 'image/png' || imgtype == 'image/gif' || imgtype == 'image/jpg') {
		  if (Math.round(parseInt(imgbytes) / 1024) > 1024) {
			this.notifications.create('Error', 'The uploaded image size must be maximum of 1 MB', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
			this.form.form.controls['image'].setValue('');
			this.form.form.controls['icon'].setValue('');
			this.form.form.controls['activeicon'].setValue('');
			return false;
		  } else {
			this.maincatsavedata.append(key, event.target.files[0], event.target.files[0]['name']);
			this.preview(event.target.files[0], key);
		  }
		} else {
		  this.notifications.create('Error', 'Unsupported File Format', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
		  this.form.form.controls['image'].setValue('');
		  this.form.form.controls['icon'].setValue('');
		  this.form.form.controls['activeicon'].setValue('');
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
	prioritychange(event) {
		this.prioirtystate = event.target.checked;

	}
	catslug(event) {
		this.catename_slug = event.target.value;
		this.AdminService.CommonApi('post', Apiconfig.categoryslug, { catename_slug: this.catename_slug }).subscribe(
			(data) => {
				if (data.status == 1) {
					this.maincateditdata.slug = '';
					this.maincateditdata.slug = data.catenewslug;
				}
			})
	}

	onSubmit() {
		this.showspinner();
		if (this.form.form.valid) {
			console.log(this.form.form.value);
			let maincategorydata = this.form.form.value;
			maincategorydata.slug = this.maincateditdata.slug ? this.maincateditdata.slug : this.form.form.value.name;
			maincategorydata.priority = this.prioirtystate == true ? 1 : 0;
			maincategorydata._id = this.maincateditdata._id;
			maincategorydata.category_language = this.maincateditdata.category_language
			maincategorydata.seo = {};
			maincategorydata.seo.title = this.form.form.value.title;
			maincategorydata.seo.keyword = this.form.form.value.keyword;
			maincategorydata.seo.description = this.form.form.value.description;
			delete maincategorydata.image;
			delete maincategorydata.icon;
			delete maincategorydata.activeicon;
			delete maincategorydata.description;
			delete maincategorydata.keyword;
			delete maincategorydata.title;

			this.maincatsavedata.append('info', JSON.stringify(maincategorydata));
			this.AdminService.CommonApi('post', Apiconfig.categorysave, this.maincatsavedata).subscribe(
				(data) => {
					if (data.status == 1) {
						this.hidespinner();
						this.buttonDisabled = false;
						this.buttonState = 'show-spinner';
						this.ngOnInit();
						this.notifications.create('Success', 'Category Saved Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
						setTimeout(() => {
							this.router.navigate(['app/categories/mainlist']);
						}, 1000);
					} else {
						this.hidespinner();
						this.notifications.create('Error', data.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
					}
				},
				(error) => {
					this.hidespinner();
					this.notifications.create('Error', error.message, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
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
