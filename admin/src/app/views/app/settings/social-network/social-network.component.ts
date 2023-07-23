import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import data from 'src/app/data/products';
import { Apiconfig } from 'src/app/_services';
import { AdminService } from "../../../../_services/admin.service";

@Component({
  selector: 'app-social-network',
  templateUrl: './social-network.component.html',
  styleUrls: ['./social-network.component.scss']
})
export class SocialNetworkComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  buttonDisabled = false;
  buttonState = '';
  socialnetworkdatas: any;
  facebook: any;
  twitter: any;
  linkedin: any;
  pinterest: any;
  youtube: any;
  googleplus: any;
  googleplay: any;
  appstore: any;
  spinner = 'none';

  constructor(private AdminService: AdminService,
    private notifications: NotificationsService) { }

  ngOnInit(): void {
    this.showspinner();
    this.AdminService.CommonApi('get', Apiconfig.getSettingsData + '?alias=social_networks', {}).subscribe(
      (results) => {
        if (results.status == 1) {
          this.hidespinner();
          this.socialnetworkdatas = results.response.settings;
          this.facebook = results.response.settings.link.filter(x => x.name == "Facebook").length > 0 ? results.response.settings.link.filter(x => x.name == "Facebook")[0] : {};
          this.twitter = results.response.settings.link.filter(x => x.name == "Twitter").length > 0 ? results.response.settings.link.filter(x => x.name == "Twitter")[0] : {};
          this.linkedin = results.response.settings.link.filter(x => x.name == "Linkedin").length > 0 ? results.response.settings.link.filter(x => x.name == "Linkedin")[0] : {};
          this.pinterest = results.response.settings.link.filter(x => x.name == "Pinterest").length > 0 ? results.response.settings.link.filter(x => x.name == "Pinterest")[0] : {};
          this.youtube = results.response.settings.link.filter(x => x.name == "Youtube").length > 0 ? results.response.settings.link.filter(x => x.name == "Youtube")[0] : {};
          this.googleplus = results.response.settings.link.filter(x => x.name == "Google Plus").length > 0 ? results.response.settings.link.filter(x => x.name == "Google Plus")[0] : {};
          //MobileAp
          this.googleplay = results.response.settings.mobileapp.filter(x => x.name == "Google Play").length > 0 ? results.response.settings.mobileapp.filter(x => x.name == "Google Play")[0] : {};
          this.appstore = results.response.settings.mobileapp.filter(x => x.name == "App Store").length > 0 ? results.response.settings.mobileapp.filter(x => x.name == "App Store")[0] : {};

          // facebook.setvalue
          this.form.form.controls['fbname'].setValue(this.facebook.name);
          this.form.form.controls['fburl'].setValue(this.facebook.url);
          this.form.form.controls['fbstatus'].setValue(this.facebook.status+'');

          // twitter.setvalue
          this.form.form.controls['twname'].setValue(this.twitter.name);
          this.form.form.controls['twurl'].setValue(this.twitter.url);
          this.form.form.controls['twstatus'].setValue(this.twitter.status+'');

          // linkedin.setvalue
          this.form.form.controls['liname'].setValue(this.linkedin.name);
          this.form.form.controls['liurl'].setValue(this.linkedin.url);
          this.form.form.controls['listatus'].setValue(this.linkedin.status+'');

          // pinterest.setvalue
          this.form.form.controls['piname'].setValue(this.pinterest.name);
          this.form.form.controls['piurl'].setValue(this.pinterest.url);
          this.form.form.controls['pistatus'].setValue(this.pinterest.status+'');

          // youtube.setvalue
          this.form.form.controls['ytname'].setValue(this.youtube.name);
          this.form.form.controls['yturl'].setValue(this.youtube.url);
          this.form.form.controls['ytstatus'].setValue(this.youtube.status+'');

          // googleplus.setvalue
          this.form.form.controls['gpname'].setValue(this.googleplus.name);
          this.form.form.controls['gpurl'].setValue(this.googleplus.url);
          this.form.form.controls['gpstatus'].setValue(this.googleplus.status+'');

          // googleplay.setvalue
          this.form.form.controls['gplname'].setValue(this.googleplay.name);
          this.form.form.controls['gplurl'].setValue(this.googleplay.url);
          this.form.form.controls['gplstatus'].setValue(this.googleplay.status+'');

          // appstore.setvalue
          this.form.form.controls['apsname'].setValue(this.appstore.name);
          this.form.form.controls['apsurl'].setValue(this.appstore.url);
          this.form.form.controls['apsstatus'].setValue(this.appstore.status+'');

        }
      })
  }
  onSubmit() {
    this.showspinner();
    if (this.form.form.valid) {
      this.buttonDisabled = true;
      this.buttonState = 'show-spinner';
      let socialdatas = {
        facebookimage: this.facebook.img,
        facebookname: this.form.form.value.fbname,
        facebookurl: this.form.form.value.fburl,
        facebookstatus: this.form.form.value.fbstatus,
        twitterimage: this.twitter.img,
        twittername: this.form.form.value.twname,
        twitterurl: this.form.form.value.twurl,
        twitterstatus: this.form.form.value.twstatus,
        linkedinimage: this.linkedin.img,
        linkedinname: this.form.form.value.liname,
        linkedinurl: this.form.form.value.liurl,
        linkedinstatus: this.form.form.value.listatus,
        pinterestimage: this.pinterest.img,
        pinterestname: this.form.form.value.piname,
        pinteresturl: this.form.form.value.piurl,
        pintereststatus: this.form.form.value.pistatus,
        youtubeimage: this.youtube.img,
        youtubename: this.form.form.value.ytname,
        youtubeurl: this.form.form.value.yturl,
        youtubestatus: this.form.form.value.ytstatus,
        googleimage: this.googleplus.img,
        googlename: this.form.form.value.gpname,
        googleurl: this.form.form.value.gpurl,
        googlestatus: this.form.form.value.gpstatus,
        googleplayimage: this.googleplay.img,
        googleplayname: this.form.form.value.gplname,
        googleplayurl: this.form.form.value.gplurl,
        googleplaystatus: this.form.form.value.gplstatus,
        appstoreimage: this.appstore.img,
        appstorename: this.form.form.value.apsname,
        appstoreurl: this.form.form.value.apsurl,
        appstorestatus: this.form.form.value.apsstatus,
      };
      this.AdminService.CommonApi('post', Apiconfig.saveSocialSettings, socialdatas).subscribe(
        (results) => {
          if (results.status == 1) {
            this.hidespinner();
            this.buttonDisabled = false;
            this.buttonState = '';
            this.notifications.create('Success', 'Social Settings Saved Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: true });
            this.ngOnInit();
          } else {
            this.buttonDisabled = false;
            this.buttonState = '';
            this.notifications.create('Error', results.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
          }
        }, (error) => {
          this.hidespinner();
          this.buttonDisabled = false;
          this.buttonState = '';
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
