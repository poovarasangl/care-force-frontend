import { TemplateRef, ViewChild, Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Apiconfig, AdminService } from "../../../../_services";
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { NgForm } from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-experts',
  templateUrl: './experts.component.html',
  styleUrls: ['./experts.component.scss']
})
export class ExpertsComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  buttonDisabled = false;
  buttonState = '';
  @ViewChild('Emailtemplate') Emailtemplate:TemplateRef<any>;
  @ViewChild('Messagetemplate') Messagetemplate:TemplateRef<any>;
  settings: any;
  editurl: '';
  deleteurl: '';
  source: LocalDataSource = new LocalDataSource();
  skip: number = 0;
  limit: number = 10;
  default_limit: number = 10;
  addbtn_name: string = 'contact.add-new';
  modalRef: BsModalRef;
  spinner = 'none';
  emaitemplets: any;
  messagetemplets:any;
  delvalue: any[];

  constructor(
    private modalService: BsModalService,
    private Apiservice: AdminService,
    private notifications: NotificationsService,
    private router: Router,
    ) { 
    this.settings = {
      selectMode: 'multi',
      hideSubHeader: true,
      columns: {
        email: {
          title: 'Expert',
          filter: true
        }
      },
        pager: {
          display: true,
          perPage: 10
        },
        actions: {
          add: false,
          edit: false,
          delete: false,
          // columnTitle: 'Actions',
          class: 'action-column',
          position: 'right',
          custom: [
            // {
            //   name: 'editaction',
            //   type: 'html',
            //   title: '<div class="action-btn badge badge-pill badge-secondary mb-1"><i class="glyph-icon simple-icon-note"></i></div>',
            // },
            // {
            //   name: 'deleteaction',
            //   title: '<div class="action-btn badge badge-pill badge-danger mb-1" title="Delete"><i class="glyph-icon simple-icon-trash"></i></div>',
            //   type: 'html',
            // },
            // {
            //   name: 'viewaction',
            //   title: '<div class="action-btn badge badge-pill badge-info mb-1" title="View"><i class="glyph-icon simple-icon-eye"></i></div>',
            //   type: 'html',
            // }
          ]
        }
      }
  }

  ngOnInit() {
    this.showspinner();
    this.Apiservice.CommonApi('get', Apiconfig.Pushnotificationemailtemplates, {}).subscribe((results: any) => {
			if (results.status === 1) {
        this.hidespinner();
        this.emaitemplets = results.response;
			} else {
        this.hidespinner();
				return;
			}
    });
    this.Apiservice.CommonApi('get', Apiconfig.Pushnotificationmessagetemplates, {}).subscribe((results: any) => {
			if (results.status === 1) {
        this.hidespinner();
        this.messagetemplets = results.response;
			} else {
        this.hidespinner();
				return;
			}
		});

    let data = {
			'skip': this.skip,
			'limit': this.limit
		}
		this.Apiservice.CommonApi('post', Apiconfig.Pushnotificationtaskerlist, data).subscribe((results: any) => {
			if (results.status === 1) {	
        this.hidespinner();		
				this.source.load(results.response);
			} else {
        this.hidespinner();
				return;
			}
		});
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }


  onitemsPerPageChange(event){

  }

  onSearchChange(event){
    this.showspinner();
    let data = {
			'skip': this.skip,
      'limit': this.limit,
      'search': event
		}
		this.Apiservice.CommonApi('post', Apiconfig.Pushnotificationtaskerlist, data).subscribe((results: any) => {
			if (results.status === 1) {
        this.hidespinner();		
				this.source.load(results.response);
			} else {
        this.hidespinner();
				return;
			}
		});
  }

  onMailSend(event){
    this.showspinner();
    if(event != undefined){
      this.hidespinner();
      this.delvalue = event.map(val=>{
        return val._id;
      });
      this.modalRef = this.modalService.show(this.Emailtemplate, { class: 'modal-md' });
    }else{
      this.hidespinner();
      this.notifications.create('Error', 'Please select user mails', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
    }
  }

  onSendNotification(event){
    this.showspinner();
    if(event != undefined){
      this.hidespinner();
        this.delvalue = event.map(val=>{
          return val._id;
        });
      this.modalRef = this.modalService.show(this.Messagetemplate, { class: 'modal-md' });
    }else{
      this.hidespinner();
      this.notifications.create('Error', 'Please select user mails', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
    }
  }

  onPageChange(event){

  }

  onSubmit(form: NgForm){
    this.showspinner();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    if (form.valid) {
      this.hidespinner();
      var data = {};
        data = form.value;
        data['ids'] = this.delvalue;
        data['type'] = 'tasker';
        
        this.modalRef.hide();
      this.Apiservice.CommonApi('post', Apiconfig.Pushnotificationsendmail, data).subscribe(
        (data) => {
          this.buttonDisabled = false;
          this.buttonState = '';
          if(data){
            if(data.status == 1 ){
              this.buttonDisabled = false;
              this.buttonState = '';
              this.notifications.create('Success', 'Email Sent SuccessFully.', NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });

            }else{
              this.buttonDisabled = false;
              this.buttonState = '';
              this.notifications.create('Error', data.response, NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
            }
          }
        }, (error) => {
          this.buttonDisabled = false;
          this.buttonState = '';
          this.notifications.create('Error', error.message, NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
        })
    }
    else {
      this.hidespinner();
      this.buttonDisabled = false;
      this.buttonState = '';
      this.notifications.create('Error', 'Please Enter all mandatory fields', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
    }
  }

  onmessageSubmit(form: NgForm){
    this.showspinner();
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    if (form.valid) {
      this.hidespinner();
      var data = {};
      data = form.value;
      data['ids'] = this.delvalue;
      data['type'] = 'tasker';
       
        this.modalRef.hide();
      this.Apiservice.CommonApi('post', Apiconfig.Pushnotificationsendmessage, data).subscribe(
        (data) => {
          this.buttonDisabled = false;
          this.buttonState = '';
          if(data){
            if(data.status == 1 ){
              this.buttonDisabled = false;
              this.buttonState = '';
              this.notifications.create('Success', "Message Sent SuccessFully.", NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });

            }else{
              this.buttonDisabled = false;
              this.buttonState = '';
              this.notifications.create('Success', data.response, NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
            }
          }
        }, (error) => {
          this.buttonDisabled = false;
          this.buttonState = '';
          this.notifications.create('Error', error.message, NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
        })
    }
    else {
      this.hidespinner();
      this.buttonDisabled = false;
      this.buttonState = '';
      this.notifications.create('Error', 'Please Enter all mandatory fields', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
    }
  }
  showspinner() {
    this.spinner = 'block'
  }
  hidespinner() {
    this.spinner = 'none';
  }

}
