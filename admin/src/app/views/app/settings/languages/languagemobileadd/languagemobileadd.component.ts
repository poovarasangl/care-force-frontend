import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { AdminService, Apiconfig } from 'src/app/_services';

@Component({
  selector: 'app-languagemobileadd',
  templateUrl: './languagemobileadd.component.html',
  styleUrls: ['./languagemobileadd.component.scss']
})
export class LanguagemobileaddComponent implements OnInit {

  LanguageList: any[];
  @ViewChild('form') form: NgForm;
  buttonDisabled = false;
  buttonState = '';
  spinner = 'none';

  constructor(
    private Apiservice: AdminService,
    private notifications: NotificationsService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.showspinner();
    let languagelist = {
      skip: 0,
      limit: 10
    }
    this.Apiservice.CommonApi('post', Apiconfig.languagelist, languagelist).subscribe(
      (results) => {
        if (results.status == 1) {
          this.hidespinner();
          this.LanguageList = results.response;
        }
      })
  }
  onSubmit() {
    this.showspinner();
    var savedata = [];
    for(var i=0; i < this.LanguageList.length;i++){
      savedata.push({
        key : this.form.form.value.content,
        value : this.form.form.value[this.LanguageList[i].name],
        code : `${this.LanguageList[i].code}_mob`
      })
    }
    if (this.form.form.valid) {
      this.Apiservice.CommonApi('post', Apiconfig.languagemanageadd, {language : savedata}).subscribe(
        (data) => {
          if (data.status == 1) {
            this.hidespinner();
            this.buttonDisabled = false;
            this.buttonState = 'show-spinner';
            this.notifications.create('Success', 'Language Saved Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
            this.ngOnInit();
            setTimeout(() => {
              this.router.navigate(['app/settings/languages/languagelist']);
            }, 1000);
          }else{
            this.hidespinner();
            this.buttonDisabled = false;
            this.buttonState = '';
            this.notifications.create('Error', data.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
          }
        }, (error) => {
          this.hidespinner();
          this.notifications.create('Error', error.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
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
