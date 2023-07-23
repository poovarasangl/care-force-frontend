import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AdminService, Apiconfig } from "src/app/_services";
import { NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-postheaderedit',
  templateUrl: './postheaderedit.component.html',
  styleUrls: ['./postheaderedit.component.scss']
})
export class PostheadereditComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  buttonDisabled = false;
  buttonState = '';
  imageUrl: string = environment.apiUrl;
  postheadereditdata: any;
  postheadersavedata = new FormData();
  editid: any;
  imagepreview = {
    image : '' as string | ArrayBuffer
  }
  spinner = 'none';

  constructor(private AdminService: AdminService,
    private notifications: NotificationsService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.showspinner();
    this.postheadersavedata = new FormData();
    this.editid = this.route.snapshot.paramMap.get('id');
    if (this.editid) {
      this.AdminService.CommonApi('post', Apiconfig.editPostHeader, { id: this.editid }).subscribe(
        (results) => {
          if (results.status == 1) {
            this.hidespinner();
            this.postheadereditdata = results.response;
            this.form.form.controls['title'].setValue(this.postheadereditdata.title);
            this.form.form.controls['description'].setValue(this.postheadereditdata.description);
            this.form.form.controls['status'].setValue(this.postheadereditdata.status+'');
          }
        })
    }
  }

  getFiles(event, key) {
    const imgbytes = event.target.files[0].size;
    const imgtype = event.target.files[0].type;
    this.postheadersavedata.delete(key);
    if (imgtype == 'image/jpeg' || imgtype == 'image/png' || imgtype == 'image/gif' || imgtype == 'image/jpg') {
      if (Math.round(parseInt(imgbytes) / 1024) > 1024) {
        this.notifications.create('Error', 'The uploaded image size must be maximum of 1 MB', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
        this.form.form.controls['image'].setValue('');
        return false;
      } else {
        this.postheadersavedata.append(key, event.target.files[0], event.target.files[0]['name']);
        this.preview(event.target.files[0], key);
      }
    } else {
      this.notifications.create('Error', 'Unsupported File Format', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
      this.form.form.controls['image'].setValue('');
      return false;
    }
  }

  preview(files,key) {
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
    // this.postheadersavedata = this.form.form.value;
    if(this.form.form.valid){
      let postheaderdata = this.form.form.value;    
      postheaderdata.postHeader = this.postheadereditdata ? this.postheadereditdata.postHeader : [];
      this.postheadersavedata.append('info', JSON.stringify(postheaderdata));
      console.log(postheaderdata);
      this.AdminService.CommonApi('post', Apiconfig.savePostHeader, this.postheadersavedata).subscribe(
        (data) => {
          if(data.status == 1){
            this.hidespinner();
            this.buttonDisabled = false;
            this.buttonState = 'show-spinner';
            this.ngOnInit();
            this.notifications.create('Success', 'Post Header Saved Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
            setTimeout(() => {
              this.router.navigate(['app/settings/postheader/postheaderlist']);
            }, 500);
          }
        }),(error)=>{
          this.hidespinner();
          this.notifications.create('Error', error.message, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
        }
    }
    else{
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
