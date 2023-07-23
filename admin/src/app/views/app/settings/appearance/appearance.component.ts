import { Component, OnInit, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { json } from 'express';
import { AdminService, Apiconfig } from 'src/app/_services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-appearance',
  templateUrl: './appearance.component.html',
  styleUrls: ['./appearance.component.scss']
})
export class AppearanceComponent implements OnInit, AfterViewInit {
  isMultiColorActive = environment.isMultiColorActive;
  @ViewChild('form') form: NgForm;
  backgroundoptioninput: boolean = false;
  appearancesavedata = new FormData();
  buttonDisabled = false;
  buttonState = '';
  backgroundimage: any;
  taskerprofile: any;
  loginpage: any;
  adminlogin: any;
  taskersignup: any;
  bannerpage: any;
  imageUrl = environment.apiUrl;
  imagepreview = {
    backgroundimage: '' as string | ArrayBuffer,
    loginpage: '' as string | ArrayBuffer,
    adminlogin: '' as string | ArrayBuffer
  }
  saveappearance = {bgoption: 1, backgroundimage: '', taskersignup: '', adminlogin: '', loginpage: '', taskerprofile: '', bannerpage: '', banner_video: '', };
  spinner = 'none';

  constructor(private Adminservice: AdminService, private renderer: Renderer2, private notifications: NotificationsService,) { }

  ngOnInit(): void {
    this.showspinner();
    this.appearancesavedata = new FormData();
    this.Adminservice.CommonApi('post', Apiconfig.getAppearanceList, {}).subscribe(
      (results) => {
        if (results.status == 1) {
          this.hidespinner();
          this.backgroundimage = results.response.filter(x => x.imagefor == "backgroundimage").length > 0 ? results.response.filter(x => x.imagefor == "backgroundimage")[0] : {};
          this.taskerprofile = results.response.filter(x => x.imagefor == "taskerprofile").length > 0 ? results.response.filter(x => x.imagefor == "taskerprofile")[0] : {};
          this.loginpage = results.response.filter(x => x.imagefor == "loginpage").length > 0 ? results.response.filter(x => x.imagefor == "loginpage")[0] : {};
          this.adminlogin = results.response.filter(x => x.imagefor == "adminlogin").length > 0 ? results.response.filter(x => x.imagefor == "adminlogin")[0] : {};
          this.taskersignup = results.response.filter(x => x.imagefor == "taskersignup").length > 0 ? results.response.filter(x => x.imagefor == "taskersignup")[0] : {};
          this.bannerpage = results.response.filter(x => x.imagefor == "bannerpage").length > 0 ? results.response.filter(x => x.imagefor == "bannerpage")[0] : {};

          this.saveappearance.backgroundimage = this.backgroundimage ? this.backgroundimage.image : '';
          this.saveappearance.taskersignup = this.taskersignup ? this.taskersignup.image : '';
          this.saveappearance.adminlogin = this.adminlogin ? this.adminlogin.image : '';
          this.saveappearance.loginpage = this.loginpage ? this.loginpage.image : '';
          this.saveappearance.taskerprofile = this.taskerprofile ? this.taskerprofile.image : '';
          this.saveappearance.bannerpage = this.bannerpage ? this.bannerpage.image : '';
          this.saveappearance.banner_video = this.bannerpage ? this.bannerpage.video : '';
        } else {
          this.hidespinner();
        }
      })
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.renderer.addClass(document.body, 'show');
      this.form.form.controls['video'].setValue(this.bannerpage.video);
    }, 1000);
    setTimeout(() => {
      this.renderer.addClass(document.body, 'default-transition');
    }, 1500);
  }
  backgroundoption(event) {
    if (event.target.checked) {
      this.bannerpage.background_option = 2;
      setTimeout(() => {
        this.form.form.controls['video'].setValue(this.bannerpage.video);
      }, 1000);
    } else {
      this.bannerpage.background_option = 1;
    }
  }
  getFiles(event, key) {
    const imgbytes = event.target.files[0].size;
    const imgtype = event.target.files[0].type;
    this.preview(event.target.files[0], key);
    this.appearancesavedata.delete(key);
    if (imgtype == 'image/jpeg' || imgtype == 'image/png' || imgtype == 'image/gif' || imgtype == 'image/jpg') {
      if (Math.round(parseInt(imgbytes) / 1024) > 1024) {
      } else {
        this.appearancesavedata.append(key, event.target.files[0], event.target.files[0]['name']);
      }
    } else {

    }
    delete this.saveappearance[key];
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
    if (this.form.form.value) {
      this.buttonDisabled = true;
      this.buttonState = 'show-spinner';
      this.saveappearance.banner_video = this.form.form.value.video;
      this.saveappearance.bgoption = this.bannerpage.background_option;
      this.appearancesavedata.append('info', JSON.stringify(this.saveappearance));
      this.Adminservice.CommonApi('post', Apiconfig.saveAppearance, this.appearancesavedata).subscribe(
        (data) => {
          if (data.status == 1) {
            this.hidespinner();
            this.buttonDisabled = false;
            this.buttonState = '';
            this.ngOnInit();
            this.notifications.create('Success', 'Appearance Saved Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
          } else {
            this.notifications.create('Error', 'Invalid entries', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
          }
        })
    } else {
      this.hidespinner();
      this.buttonDisabled = false;
      this.buttonState = '';
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
