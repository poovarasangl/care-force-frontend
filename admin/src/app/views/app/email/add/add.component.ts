import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AdminService, Apiconfig } from "../../../../_services";
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationType, NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  buttonDisabled = false;
  buttonState = '';
  title: any;
  skip: number = 0;
  limit: number = 50;
  emailTemplateName: any;
  emailTemplateLanguage: any;
  emailContantFromTemplate: String;
  listOfEmailTemplates: any;
  translateLanguage: any;
  subscriptionCheck: any;
  dispatchMailCheck: any;
  editid : string;
  spinner = 'none';

  constructor(private apiService: AdminService, private router: Router, 
    private ActivatedRoute: ActivatedRoute, private notifications : NotificationsService) { }

  ngOnInit(): void {
    this.editid = this.ActivatedRoute.snapshot.paramMap.get('id');
    if (this.editid) {
      this.showspinner();
      this.title = 'Edit';
      this.apiService.CommonApi('post', Apiconfig.editTemplate, { id: this.editid }).subscribe(result => {
        if (result) {
          this.hidespinner();
          this.form.form.controls['emailSubject'].setValue(result.response.email_subject);
          this.form.form.controls['templateName'].setValue(result.response.name);
          this.form.form.controls['senderName'].setValue(result.response.sender_name);
          this.form.form.controls['selectLanguage'].setValue(result.response.lang);
          this.emailContantFromTemplate = result.response.email_content;
          this.subscriptionCheck = result.response.subscription;
          this.dispatchMailCheck = result.response.dispatch_mail;
        } (err) => {
          this.hidespinner();
          console.log(err);
        }
      });
    } else {
      this.title = 'Add';
    }
    let data = {
      'skip': this.skip,
      'limit': this.limit
    }
    this.apiService.CommonApi('post', Apiconfig.templateList, data).subscribe(result => {
      if (result.status == 1) {
        this.listOfEmailTemplates = result.response;
        this.emailTemplateName = result.response.map(o => ({ id: o.name, name: o.name }));
      } else {
        return;
      } (err) => {
        console.log(err);
      }
    });
    this.apiService.CommonApi('get', Apiconfig.translateLanguage, data).subscribe(result => {
      if (result.status == 1) {
        this.emailTemplateLanguage = result.response.languagedata.map(o => ({ id: o.code, name: o.name }));
      } else {
        return;
      }
    })
  }

  ngAfterViewInit() {
    if (!this.editid) {
      setTimeout(() => {
        this.form.form.controls['templateName'].setValue(null);
        this.form.form.controls['selectLanguage'].setValue(null);
      }, 300);
    }
  }
  
  onClick() {
    let templateData = this.form.form.get('templateName').value
    if (templateData) {
      let temp = this.listOfEmailTemplates.filter(x => x.name == templateData)
      this.emailContantFromTemplate = temp[0].email_content;
    }
  }

  onSubmit() {
    this.showspinner();
    this.buttonDisabled = true;
    if (this.form.form.valid) {
      this.buttonState = 'show-spinner';
      let data = {
        'email_content': this.emailContantFromTemplate,
        'email_subject': this.form.form.get('emailSubject').value,
        'lang': this.form.form.get('selectLanguage').value,
        'name': this.form.form.get('templateName').value,
        'sender_name': this.form.form.get('senderName').value,
        'dispatch_mail': this.form.form.get('dispatchMail').value ? 1 : 0,
        'subscription': this.form.form.get('subscription').value ? 1 : 0,
        'status': 1,
        _id : this.editid
      }
      this.apiService.CommonApi('post', Apiconfig.addTemplate, data).subscribe(result => {
        if(result.status == 1){
          this.hidespinner();
          setTimeout(() => {
            this.buttonDisabled = false;
            this.buttonState = 'show-spinner';
            this.notifications.create('Success', 'Email Template Added Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: true });
            this.router.navigate(['/app/email/email-template-list']);
          }, 1000);
        }
      });
    } else {
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
