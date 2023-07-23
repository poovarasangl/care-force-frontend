import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AdminService, Apiconfig, AuthenticationService } from "src/app/_services";
import { NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-subcategoriesedit',
  templateUrl: './subcategoriesedit.component.html',
  styleUrls: ['./subcategoriesedit.component.scss']
})
export class SubcategorieseditComponent implements OnInit {

  @ViewChild('form') form: NgForm;
	buttonDisabled = false;
	buttonState = '';
	imageUrl: string = environment.apiUrl;
	subcateditdata={} as  any;
	subcatsavedata = new FormData();
	prioirtystate: boolean = false;
	editid: any;
	catename_slug: string = '';
	imagepreview = {
		image: '' as string | ArrayBuffer,
		icon: '' as string | ArrayBuffer,
		activeicon: '' as string | ArrayBuffer
	}
	languagelist: any;
	rateType: any;
	spinner = 'none';
	curentUser: any;
	userPrivilegeDetails: any;
	access: boolean = true;
	catlist:any
	constructor(private AdminService: AdminService,
		private notifications: NotificationsService,
		private router: Router,
		private route: ActivatedRoute,
		private authService: AuthenticationService,
	) {
		this.curentUser = this.authService.currentUserValue;
		if (this.curentUser && this.curentUser.user_details && this.curentUser.user_details.role == "subadmin") {
			if (this.route.snapshot.routeConfig.component.name == 'SubcategorieseditComponent') {
				let data = this.curentUser.user_details.privileges.filter(x => x.alias == 'categories');
				this.userPrivilegeDetails = data.length > 0 ? data[0].status : {};
			}
		}
	}

	ngOnInit(): void {
		this.subcatsavedata = new FormData();
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
			this.AdminService.CommonApi('get', Apiconfig.taskercatlist,{}).subscribe(
				(results: any) => {
					if (results.status === 1) {
						this.catlist = results.response;
						console.log(this.catlist);
						

					}
				})
		this.editid = this.route.snapshot.paramMap.get('id');
		if (this.editid) {
			this.showspinner();
			this.AdminService.CommonApi('post', Apiconfig.categoryedit, { id: this.editid }).subscribe(
				(results) => {
					if (results.status == 1) {
						this.hidespinner();
						this.subcateditdata = results.response;
						console.log(this.subcateditdata,'[[]]')
						this.form.form.controls['name'].setValue(this.subcateditdata.name);
						this.form.form.controls['hours'].setValue(this.subcateditdata.hours);
						this.form.form.controls['ratetype'].setValue(this.subcateditdata.ratetype);
            			this.form.form.controls['commision'].setValue(this.subcateditdata.commision);
						this.form.form.controls['parent'].setValue(this.subcateditdata.parent);

            			this.form.form.controls['admincommision'].setValue(this.subcateditdata.admincommision);
						this.form.form.controls['status'].setValue(this.subcateditdata.status+'');
						this.subcateditdata.priority = this.subcateditdata.priority ? parseInt(this.subcateditdata.priority) : 0;
						this.prioirtystate = this.subcateditdata.priority == '1' ? true : false;
					}
				})
		} else {
			this.hidespinner();
		}
	}
	getFiles(event, key) {
		const imgbytes = event.target.files[0].size;
		const imgtype = event.target.files[0].type;
		this.subcatsavedata.delete(key);
		if (imgtype == 'image/jpeg' || imgtype == 'image/png' || imgtype == 'image/gif' || imgtype == 'image/jpg') {
		  if (Math.round(parseInt(imgbytes) / 1024) > 1024) {
			this.notifications.create('Error', 'The uploaded image size must be maximum of 1 MB', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
			this.form.form.controls['image'].setValue('');
			this.form.form.controls['icon'].setValue('');
			this.form.form.controls['activeicon'].setValue('');
			return false;
		  } else {
			this.subcatsavedata.append(key, event.target.files[0], event.target.files[0]['name']);
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
				console.log(data,"data")
				if (data.status == 1) {
          this.subcateditdata.slug = '';
          this.subcateditdata.slug = data.catenewslug;
				}
			})
	}
	rateTypeCheck(event){
		this.rateType = event.id;
	}

	onSubmit() {
		this.showspinner();
		if (this.form.form.valid) {
			let subcategorydata = this.form.form.value;
			console.log('this.form.form.valid',this.subcateditdata.slug )
			subcategorydata.slug = this.subcateditdata.slug ? this.subcateditdata.slug : this.form.form.value.name;
			subcategorydata.priority = this.prioirtystate == true ? 1 : 0;
      subcategorydata._id = this.subcateditdata._id;
      subcategorydata.parent = this.subcateditdata.parent ?this.subcateditdata.parent: this.form.form.value.parent ;
			subcategorydata.category_language = this.subcateditdata.category_language;
			delete subcategorydata.image;
			delete subcategorydata.icon;
			delete subcategorydata.activeicon;

			this.subcatsavedata.append('info', JSON.stringify(subcategorydata));
			this.AdminService.CommonApi('post', Apiconfig.subcategorysave, this.subcatsavedata).subscribe(
				(data) => {
					if (data.status == 1) {
						this.hidespinner();
						this.buttonDisabled = false;
						this.buttonState = 'show-spinner';
						this.ngOnInit();
						this.notifications.create('Success', 'Category Saved Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
						setTimeout(() => {
							this.router.navigate(['app/categories/sublist']);
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
