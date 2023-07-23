import { DatePipe } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { Apiconfig, AdminService, AuthenticationService } from "../../../../_services";

@Component({
	selector: 'app-alljobs',
	templateUrl: './alljobs.component.html',
	styleUrls: ['./alljobs.component.scss']
})
export class AlljobsComponent implements OnInit {
	settings: any;
	viewurl = 'app/jobs/jobdetails';
	deleteurl = Apiconfig.jobDelete;
	source: LocalDataSource = new LocalDataSource();
	skip: number = 0;
	limit: number = 10;
	count: number = 0;
	default_limit: number = 10;
	card_details: any[];
	jobdata: any;
	path = '';
	pathArr: string[] = [];
	currentRoute = '';
	global_status: number;
	global_search: any;
	from_date: any;
	to_date: any;
	spinner = 'none';
	data = {
		'skip': this.skip,
		'limit': this.limit,
		'status': 0
	};
	curentUser: any;
	userPrivilegeDetails: any;

	constructor(
		private apiService: AdminService, 
		private notifications: NotificationsService,
		private cd: ChangeDetectorRef,
		private authService: AuthenticationService,
		private router: Router) {
		this.curentUser = this.authService.currentUserValue;
		if (this.curentUser && this.curentUser.user_details && this.curentUser.user_details.role == "subadmin") {
			if (this.router.url == '/app/jobs/all-jobs') {
				this.userPrivilegeDetails = this.curentUser.user_details.privileges.filter(x => x.alias == 'tasks');
			}
		}
		this.loadsettings('');
	}

	ngOnInit(): void {
		this.routeChange();
		this.apiService.CommonApi('post', Apiconfig.jobList, this.data).subscribe((result: any) => {
			if (result.status === 1) {
				this.hidespinner();
				this.loadCard_Details(result.allValue || 0, result.onGoingValue || 0, result.PaymentPendingValue || 0, result.completedValue || 0, result.cancelValue || 0, result.deleteValue || 0);
				this.jobdata = result.response.filter(item => item.status);
				this.jobdata.forEach(item => {
					this.ststusNameConvertion(item);
				});
				this.source.load(this.jobdata);
				this.count = result.count;
				this.cd.detectChanges();
			} else {
				this.hidespinner();
				return;
			}
		});
	}

	routeChange() {
		this.showspinner();
		const currentUrl = this.router.url;
		if (currentUrl.includes('alljobs')) {
			this.data.status = 0;
		} else if (currentUrl.includes('ongoing')) {
			this.data.status = 1;
		} else if (currentUrl.includes('paymentpending')) {
			this.data.status = 6;
		} else if (currentUrl.includes('completed')) {
			this.data.status = 7;
		} else if (currentUrl.includes('cancelled')) {
			this.data.status = 8;
		} else if (currentUrl.includes('expired')) {
			this.data.status = 11;
		}
	}
	ststusNameConvertion(item) {
		switch (item.status) {
			case 1:
				item.status = 'Assigned';
				break;
			case 2:
				item.status = 'Accepted';
				break;
			case 3:
				item.status = 'StartOff';
				break;
			case 4:
				item.status = 'Arrived';
				break;
			case 5:
				item.status = 'Start Job';
				break;
			case 6:
				item.status = 'Payment Pending';
				break;
			case 7:
				item.status = 'Payment Completed';
				break;
			case 8:
				item.status = 'Cancelled';
				break;
			case 9:
				item.status = 'Disputed';
				break;
			case 0:
				item.status = 'Deleted';
				break;
		}
	}

	onDeleteChange(event) {
		this.notifications.create('Success', event, NotificationType.Success, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
		this.ngOnInit();
	}

	onForcedelete(data) {
		this.showspinner();
		let deletedata = [];
		if (data && typeof data[0]._id != 'undefined') {
			deletedata = data.map(x => x._id);
			this.apiService.CommonApi('post', Apiconfig.jobRemove, { ids: deletedata }).subscribe(
				(result) => {
					if (result.status == 1) {
						this.hidespinner();
						this.onheaderCardChange('deleteValue')
						this.count = result.count;
					}
				}, (error) => {
					this.hidespinner();
					console.log(error);
				})
		} else if (typeof data == 'undefined') {
			this.hidespinner();
			this.onheaderCardChange('deleteValue')
		}
	}

	onPageChange(event) {
		this.showspinner();
		this.source = new LocalDataSource();
		let data = {
		  'skip': this.limit * (event - 1),
		  'limit': this.limit * event
		}
		this.apiService.CommonApi('post', Apiconfig.jobList, data).subscribe((result: any) => {
			if (result.status === 1) {
				this.hidespinner();
			this.source.load(result.response);
			this.count = result.count;
				this.cd.detectChanges();
			} else {
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
			'search': event
		}

		if(this.global_status){
			data['status'] = this.global_status;
		}
		this.apiService.CommonApi('post', Apiconfig.jobList, data).subscribe((result: any) => {
			if (result.status === 1) {
				this.hidespinner();
				this.loadCard_Details(result.allValue || 0, result.onGoingValue || 0, result.PaymentPendingValue || 0, result.completedValue || 0, result.cancelValue || 0, result.deleteValue || 0);
				this.jobdata = result.response.filter(item => item.status);
				this.jobdata.forEach(item => {
					this.ststusNameConvertion(item);
				});
				this.source.load(result.response);
				this.count = result.count;
				this.cd.detectChanges();
			} else {
				this.hidespinner();
				return;
			}
		});
	}

	onitemsPerPageChange(event) {
		this.showspinner();
		this.limit = event;
		this.skip = 0;
		this.default_limit = event;
		let data = {
			'skip': this.skip,
			'limit': this.limit
		}

		this.apiService.CommonApi('post', Apiconfig.jobList, data).subscribe((result: any) => {
			if (result.status === 1) {
				this.hidespinner();
				this.loadCard_Details(result.allValue || 0, result.onGoingValue || 0, result.PaymentPendingValue || 0, result.completedValue || 0, result.cancelValue || 0, result.deleteValue || 0);
				this.jobdata = result.response.filter(item => item.status);
				this.jobdata.forEach(item => {
					this.ststusNameConvertion(item);
				});
				this.source.load(this.jobdata);
				this.count = result.count;
				this.cd.detectChanges();
			} else {
				this.hidespinner();
				return;
			}
		});

	}

	onheaderCardChange(event) {
		this.showspinner();
		this.source = new LocalDataSource();
		if (event == 'allValue') {
			this.data.status = 0;
			this.global_status = 0;
		} else if (event == 'onGoingValue') {
			this.data.status = 1;
			this.global_status = 1;
		} else if (event == 'PaymentPendingValue') {
			this.data.status = 6;
			this.global_status = 6;
		} else if (event == 'completedValue') {
			this.data.status = 7;
			this.global_status = 7;
		} else if (event == 'cancelValue') {
			this.data.status = 8;
			this.global_status = 8;
		} else if (event == 'deleteValue') {
			this.data.status = 2;
			this.global_status = 2;
		}
		this.loadsettings(event);
		this.apiService.CommonApi('post', Apiconfig.jobList, this.data).subscribe((result: any) => {
			if (result.status === 1) {
				this.hidespinner();
				this.loadCard_Details(result.allValue || 0, result.onGoingValue || 0, result.PaymentPendingValue || 0, result.completedValue || 0, result.cancelValue || 0, result.deleteValue || 0);
				this.jobdata = result.response;
				this.jobdata.forEach(item => {
					this.ststusNameConvertion(item);
				});
				this.source.load(this.jobdata);
				this.count = result.count;
				this.cd.detectChanges();
			} else {
				this.hidespinner();
				return;
			}
		});
	}

	loadCard_Details(alljobs, ongoing, paymentPending, completed, cancelled, deleted) {
		this.card_details = [
			{
				title: 'ALL JOBS',
				value: alljobs,
				bg_color: 'bg-dark',
				icon: 'fa fa-navicon',
				click_val: 'allValue'
			},
			{
				title: 'ONGOING',
				value: ongoing,
				bg_color: 'bg-secondary',
				icon: 'fa fa-tasks',
				click_val: 'onGoingValue'
			},
			{
				title: 'PAYMENT PENDING',
				value: paymentPending,
				bg_color: 'bg-info',
				icon: 'fa fa-clock-o',
				click_val: 'PaymentPendingValue'
			},
			{
				title: 'COMPLETED',
				value: completed,
				bg_color: 'bg-success',
				icon: 'fa fa-check-square-o',
				click_val: 'completedValue'
			},
			{
				title: "CANCELLED",
				value: cancelled,
				bg_color: 'bg-danger',
				icon: 'fa fa-times',
				click_val: 'cancelValue'
			},
			{
				title: "TRASHED",
				value: deleted,
				bg_color: 'bg-danger',
				icon: 'fa fa-trash-o',
				click_val: 'deleteValue'
			},
		];
	}

	loadsettings(event) {
		if (event == 'deleteValue') {
			this.settings = {
				selectMode: 'multi',
				hideSubHeader: true,
				columns: {
					booking_id: {
						title: 'Task ID',
						filter: true
					},
					category: {
						title: 'Task Category',
						filter: true,
						valuePrepareFunction: value => {
							if(!value){
								return '--';
							}else{
								return value;
							}
						}
					},
					user: {
						title: 'User',
						filter: true,
						valuePrepareFunction: value => {
							if(!value){
								return '--';
							}else{
								return value;
							}
						}
					},
					tasker: {
						title: 'Tasker',
						filter: true,
						valuePrepareFunction: value => {
							if(!value){
								return '--';
							}else{
								return value;
							}
						}
					},
					updatedAt: {
						title: 'Last Updated',
						filter: true,
						valuePrepareFunction: date => {
							if (date) {
								return new DatePipe('en-US').transform(date, 'dd-MMM-yyyy, hh-mm a');
							} else {
								return null;
							}
						}
					},
					status: {
						title: 'Status',
						filter: true,
					},
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
					custom: [],
				},
			}
			if (this.curentUser && this.curentUser.user_details && this.curentUser.user_details.role == "subadmin") {
				if (this.router.url == 'app/jobs/all-jobs') {
					if (this.userPrivilegeDetails && this.userPrivilegeDetails.length > 0) {
						if (this.userPrivilegeDetails[0].status.view) {
							this.settings.actions.custom.push(
								{
									name: 'viewaction',
									value: "View Job Details",
									title: '<div class="action-btn badge badge-pill badge-info mb-1" title="View"><i class="glyph-icon simple-icon-eye"></i></div>',
									type: 'html',
								});
						}
						if (this.userPrivilegeDetails[0].status.delete) {
							this.settings.actions.custom.push(
								{
									name: 'forcedeleteaction',
									value: 'Permanent Delete',
									title: '<div class="action-btn badge badge-pill badge-danger mb-1"><i class="glyph-icon simple-icon-trash"></i></div>',
									type: 'html',
								});
						}
					}
				}
			} else {
				this.settings.actions.custom.push(
					{
						name: 'forcedeleteaction',
							value: "Permenent Delete",
							title: '<div class="action-btn badge badge-pill badge-danger mb-1" title="Delete"><i class="glyph-icon simple-icon-trash"></i></div>',
							type: 'html',
						},
						{
							name: 'viewaction',
							value: "View Job Details",
							title: '<div class="action-btn badge badge-pill badge-info mb-1" title="View"><i class="glyph-icon simple-icon-eye"></i></div>',
							type: 'html',
					});
			}
		} else {
			this.settings = {
				selectMode: 'multi',
				hideSubHeader: true,
				columns: {
					booking_id: {
						title: 'Task ID',
						filter: true
					},
					category: {
						title: 'Task Category',
						filter: true,
						type:'html',
						valuePrepareFunction: value => {
							if(!value){
								return '--';
							}else{
								return value;
							}
					}
					},
					user: {
						title: 'User',
						filter: true,
						valuePrepareFunction: value => {
							if(!value){
								return '--';
							}else{
								return value;
							}
						}
					},
					tasker: {
						title: 'Tasker',
						filter: true,
						valuePrepareFunction: value => {
							if(!value){
								return '--';
							}else{
								return value;
							}
						}
					},
					updatedAt: {
						title: 'Last Updated',
						filter: true,
						valuePrepareFunction: date => {
							if (date) {
								return new DatePipe('en-US').transform(date, 'dd-MMM-yyyy, hh-mm a');
							} else {
								return null;
							}
						}
					},
					status: {
						title: 'Status',
						filter: true,
					},
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
					custom: [],
				},
			}
			if (this.curentUser && this.curentUser.user_details && this.curentUser.user_details.role == "subadmin") {
				if (this.router.url == 'app/jobs/all-jobs') {
					if (this.userPrivilegeDetails && this.userPrivilegeDetails.length > 0) {
						if (this.userPrivilegeDetails[0].status.view) {
							this.settings.actions.custom.push(
								{
									name: 'viewaction',
									value: "View Job Details",
									title: '<div class="action-btn badge badge-pill badge-info mb-1" title="View"><i class="glyph-icon simple-icon-eye"></i></div>',
									type: 'html',
								});
						}
						if (this.userPrivilegeDetails[0].status.delete) {
							this.settings.actions.custom.push(
								{
									name: 'deleteaction',
									value: 'Delete',
									title: '<div class="action-btn badge badge-pill badge-danger mb-1"><i class="glyph-icon simple-icon-trash"></i></div>',
									type: 'html',
								});
						}
					}
				}
			} else {
				this.settings.actions.custom.push(
						{
							name: 'deleteaction',
							value: "Delete",
							title: '<div class="action-btn badge badge-pill badge-danger mb-1" title="Delete"><i class="glyph-icon simple-icon-trash"></i></div>',
							type: 'html',
						},
						{
							name: 'viewaction',
							value: "View Job Details",
							title: '<div class="action-btn badge badge-pill badge-info mb-1" title="View"><i class="glyph-icon simple-icon-eye"></i></div>',
							type: 'html',
					});
			}
		}
	}

	onAlljobsFilter(event){
		this.showspinner();
		var data = {
			'skip': this.skip,
			'limit': this.limit,
			'status': 0
		}
		data['date']={};
		if(event.from){
			data['date']['from'] = new Date(event.from).setHours(0, 0, 0, 0);
			this.from_date = new Date(event.from).setHours(0, 0, 0, 0);
		}
		if(event.to){
			data['date']['to'] = new Date(event.to).setHours(23, 59, 59, 0);
			this.to_date = new Date(event.to).setHours(23, 59, 59, 0);
		}
		this.apiService.CommonApi('post', Apiconfig.jobList, data).subscribe((result: any) => {
			if (result.status === 1) {
				this.hidespinner();
				this.loadCard_Details(result.allValue || 0, result.onGoingValue || 0, result.PaymentPendingValue || 0, result.completedValue || 0, result.cancelValue || 0, result.deleteValue || 0);
				this.jobdata = result.response.filter(item => item.status);
				this.jobdata.forEach(item => {
					this.ststusNameConvertion(item);
				});
				this.source.load(this.jobdata);
				this.count = result.count;
				this.cd.detectChanges();
			} else {
				this.hidespinner();
				return;
			}
		});
	}

	onexportemit(event){
		this.showspinner();
		let data = {
			'skip': this.skip,
			'limit': this.limit,
			'format': event,
			'collection': 'task',
			'role': 'task'
		}
		if(this.global_search){
			data['search'] = this.global_search;
		}
		if(this.global_status){
			data['status'] = this.global_status;
		}else{
			data['status'] = 0;
		}
		if(this.from_date || this.to_date){
			data['date']={};
		}
		if(this.from_date){
			data['date']['from'] = this.from_date;
		}
		if(this.to_date){
			data['date']['to'] = this.to_date;
		}

		this.apiService.CommonApi('post', Apiconfig.exprotmangement, data).subscribe((results: any) => {
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
