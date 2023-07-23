import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../alert/alert.service';
import { StoreService } from '../../store/store.service';
import { SpinnerService } from '../../spinner/spinner.service';
@Component({
  selector: 'app-invite-friends',
  templateUrl: './invite-friends.component.html',
  styleUrls: ['./invite-friends.component.sass']
})
export class InviteFriendsComponent implements OnInit {
  settingdata:any;

  constructor(private toastr : AlertService,private store:StoreService,
    private spinner : SpinnerService) { }

  ngOnInit() {
    this.hidespinner();
    localStorage.setItem('showtab','InviteFriendstab');
    this.store.landingdata.subscribe((result:any)=>{
      this.settingdata = result.settings;
    });
  }
  googleInviteFriends(){
    let subject = '';
    let bodyText ='';
    let emailTo =''
    // window.open("mailto:" + "?subject=" + subject + '&body=' + bodyText, "_blank");
    // location.href = "mailto:"+emailTo+'&subject='+subject+'&body='+bodyText,"_blank";
    window.open("https://www.gmail.com", '_blank')
  }
  facebookInviteFriends(){
    // window.location.href = "https://www.facebook.com/dialog/oauth?client_id="+this.settingdata.fbappId;
    window.open("https://www.facebook.com/dialog/oauth?client_id="+this.settingdata.fbappId, '_blank')

  }
  successmsg(msg) {
    setTimeout(() => {
      this.toastr.clear();
    },2000);
    this.toastr.success(msg);
  }
  errorsmsg(msg) {
    setTimeout(() => {
      this.toastr.clear();
    },2000);
    this.toastr.error(msg);
  }
  warningmsg(msg) {
    setTimeout(() => {
      this.toastr.clear();
    },2000);
    this.toastr.warn(msg);
  }
  showspinner() {
    this.spinner.Spinner('show');
  }
  hidespinner() {
    this.spinner.Spinner('hide');
  }
}
