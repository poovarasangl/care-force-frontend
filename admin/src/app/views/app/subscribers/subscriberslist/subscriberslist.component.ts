import { TemplateRef, ViewChild, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { Apiconfig, AdminService } from "../../../../_services";
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-subscriberslist',
  templateUrl: './subscriberslist.component.html',
  styleUrls: ['./subscriberslist.component.scss']
})
export class SubscriberslistComponent implements OnInit {
	@ViewChild('form') form: NgForm;
	buttonDisabled = false;
	buttonState = '';
	@ViewChild('Emailtemplate') Emailtemplate:TemplateRef<any>;
	settings: any;
	filter_data: any;
	source: LocalDataSource = new LocalDataSource();
	deleteurl: string = Apiconfig.subscribersdelete;
	modalRef: BsModalRef;
	emaitemplets: any;
	delvalue: any[];
	global_search: any;
	skip: number = 0;
	limit: number = 10;
	count : number = 0;
	default_limit : number = 10;
	spinner = 'none';

	constructor(
		private Apiservice: AdminService,
		private router: Router,
		private notifications: NotificationsService,
		private modalService: BsModalService,
		private cd: ChangeDetectorRef,
	) {
		
		this.settings = {
				selectMode: 'multi',
				hideSubHeader: true,
				columns: {
					email: {
						title: 'Subscriber',
						filter: true
					},
					createdAt: {
						title: 'Date',
						filter: true,
						valuePrepareFunction: date => {
							if (date) {
								return new DatePipe('en-US').transform(date, 'MMM dd, yyyy');
							} else {
								return null;
							}
						}
					}
				},
				pager: {
					display: true,
					perPage: this.default_limit
				},
				actions: {
					add: true,
					edit: false,
					delete: false,
					columnTitle: 'Actions',
					class: 'action-column',
					position: 'right',
					custom: [
						{
							name: 'deleteaction',
							value: "Delete",
							title: '<div class="action-btn badge badge-pill badge-danger mb-1" title="Delete"><i class="glyph-icon simple-icon-trash"></i></div>',
							type: 'html',
						}
					],
				},
			}
	}

   	ngOnInit() {
			  this.showspinner();
		this.Apiservice.CommonApi('get', Apiconfig.subscribersmailtemplates, {}).subscribe((results: any) => {
			if (results.status === 1) {
				this.hidespinner();
				this.emaitemplets = results.response;
				this.count = results.count;
			} else {
				this.hidespinner();
				return;
			}
		});

		let data = {
			'skip': this.skip,
			'limit': this.limit
		}
		this.Apiservice.CommonApi('post', Apiconfig.subscriberslist, data).subscribe((results: any) => {
			if (results) {
				this.hidespinner();
				if(results.status == 1){
					this.source.load(results.response);
					this.count = results.count;
					this.cd.detectChanges();
				}
			} else {
				this.hidespinner();
				return;
			}
			});
	}

  	onDeleteChange(event) {
        this.notifications.create('Success', event, NotificationType.Success, { theClass: 'outline', timeOut: 3000, showProgressBar: true });		
		this.ngOnInit();
	}

	onPageChange(event) {
		this.showspinner(); 
		this.source = new LocalDataSource();
		let data = {
		  'skip': this.limit * (event - 1),
		  'limit': this.limit * event
		}
		this.Apiservice.CommonApi('post', Apiconfig.subscriberslist, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.hidespinner();
				this.source.load(results.response);
				this.count = results.count;
				this.cd.detectChanges();
			}else{
				this.hidespinner();
				return;
			}
		});
	}

	onSearchChange(event) {
		this.showspinner();
		this.source = new LocalDataSource();
		this.global_search = event;
		let data = {
			'skip': this.skip,
			'limit': this.limit,
			'search' : event
		}
		this.Apiservice.CommonApi('post', Apiconfig.subscriberslist, data).subscribe((results: any) => {
			if (results) {
				this.hidespinner();
				if(results.status == 1){
					this.source.load(results.response);
					this.count = results.count;
					this.cd.detectChanges();
				}else{
					this.hidespinner();
					return;
				}
			} else {
				this.hidespinner();
				return;
			}
		});
	}
	onAddnewChange(event) {
		console.log(event);
	}
	onBulkactionChange(event) {
		console.log(event);
	}
	onitemsPerPageChange(event) {
		this.showspinner();
		this.limit = event;
		this.skip = 0;
		this.default_limit = event;
		this.source = new LocalDataSource();
		let data = {
			'skip': this.skip,
			'limit': this.limit
		}
		this.Apiservice.CommonApi('post', Apiconfig.subscriberslist,data).subscribe((results: any) => {
			if (results) {
				this.hidespinner();
				if(results.status == 1){
					this.source.load(results.response);
					this.count = results.count;
					this.cd.detectChanges();
				}else{
					return;
				}	 
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
			this.notifications.create('Error', 'Please select subscriber', NotificationType.Error, { theClass: 'outline', timeOut: 6000, showProgressBar: true });
		}
	}

	onSubmit(form: NgForm){
		this.showspinner();
		this.buttonDisabled = true;
		this.buttonState = 'show-spinner';
		if (form.valid) {
			this.hidespinner();
		  var data = {};
			data = form.value;
			data['delvalue'] = this.delvalue;
			
			this.modalRef.hide();
		  this.Apiservice.CommonApi('post', Apiconfig.subscriberssendmail, data).subscribe(
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
					this.notifications.create('Error', data.response, NotificationType.Error, { theClass: 'outline', timeOut: 6000, showProgressBar: true });
				}
			  }
			}, (error) => {
			  this.buttonDisabled = false;
			  this.buttonState = '';
				  this.notifications.create('Error', error.message, NotificationType.Error, { theClass: 'outline', timeOut: 6000, showProgressBar: true });
			})
		}
		else {
			this.hidespinner();
		  this.buttonDisabled = false;
		  this.buttonState = '';
			this.notifications.create('Error', 'Please Enter all mandatory fields', NotificationType.Error, { theClass: 'outline', timeOut: 6000, showProgressBar: true });
		}
	}

	onexportemit(event){
		this.showspinner();
		let data = {
			'skip': this.skip,
			'limit': this.limit,
			'format': event,
			'status': 0,
			'collection': 'newsletter'
		}
		if(this.global_search){
			data['search'] = this.global_search;
		}
	
		this.Apiservice.CommonApi('post', Apiconfig.exprotmangement, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.hidespinner();
				this.notifications.create('Success', results.response, NotificationType.Success, { theClass: 'outline', timeOut: 3000, showProgressBar: false });
			} else {
				this.hidespinner();
				this.notifications.create('Error', results.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: false });
			}
		});

	}
	showspinner() {
		this.spinner = 'block'
	}
	hidespinner() {
		this.spinner = 'none';
	}
}
