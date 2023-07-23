import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService, Apiconfig } from 'src/app/_services';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-contactedit',
  templateUrl: './contactedit.component.html',
  styleUrls: ['./contactedit.component.scss']
})
export class ContacteditComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  buttonDisabled = false;
  buttonState = '';
  editdata = { _id: '', email: '', updatedAt: '', name: '', mobile: '', subject: '', message: '' };
  editid: string = '';
  modalRef: BsModalRef;
  replymail = { message: '', subject: '' };
  formfield: any;
  spinner = 'none';
  constructor(
    private route: ActivatedRoute,
    private apiservice: AdminService,
    private modalService: BsModalService,
    private notifications: NotificationsService
  ) {
    this.editid = this.route.snapshot.paramMap.get('id');
    this.showspinner();
    if (this.editid) {
      this.hidespinner();
      this.apiservice.CommonApi('post', Apiconfig.ContactView, { id: this.editid }).subscribe((data) => {
        if (data.status == 1) {
          this.editdata = data.response;
        }
      })
    }
  }

  ngOnInit(): void {

  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  onSubmit() {
    this.showspinner();
    if (this.replymail.message != '' && this.replymail.subject != '') {
      this.buttonDisabled = true;
      this.buttonState = 'show-spinner'
      let data = { content: this.replymail, id: this.editdata.email };
      this.apiservice.CommonApi('post', Apiconfig.ContactReply, data).subscribe(
        (result) => {
          this.hidespinner();
          this.modalRef.hide();
          if(result.status == 1){
            this.notifications.create('Success', 'Reply Mail Sent Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
          }else{
            this.notifications.create('Error', result.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
          }
        }, (error) => {
          this.hidespinner();
          this.notifications.create('Error', error, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
        })
    } else {
      this.hidespinner();
      this.formfield = 0;
      this.buttonState = '';
      this.notifications.create('Error', 'Form Invalid', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
    }
  }
  showspinner() {
    this.spinner = 'block'
  }
  hidespinner() {
    this.spinner = 'none';
  }
}
