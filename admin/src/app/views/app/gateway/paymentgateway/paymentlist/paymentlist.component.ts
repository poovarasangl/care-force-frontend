import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { Apiconfig, AdminService, AuthenticationService } from "../../../../../_services";
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paymentlist',
  templateUrl: './paymentlist.component.html',
  styleUrls: ['./paymentlist.component.scss']
})
export class PaymentlistComponent implements OnInit {

  settings: any;
	skip: number = 0;
	limit: number = 10;
	default_limit : number = 10;
	count : number = 0;
	source: LocalDataSource = new LocalDataSource();
	editurl: string = '/app/gateway/paymentgateway/paymentedit';
	deleteurl: string = Apiconfig.paymentdelete;
	spinner = 'none';
	curentUser: any;
	userPrivilegeDetails: any;
	constructor(
		private Apiservice: AdminService,
		private notifications: NotificationsService,
		private cd: ChangeDetectorRef,
		private authService: AuthenticationService,
		private router: Router
	) {
		this.curentUser = this.authService.currentUserValue;
		if (this.curentUser && this.curentUser.user_details && this.curentUser.user_details.role == "subadmin") {
			if (this.router.url == '/app/gateway/paymentgateway/paymentlist') {
				this.userPrivilegeDetails = this.curentUser.user_details.privileges.filter(x => x.alias == 'payment');
			}
		}
		this.loadsettings();
	}
	ngOnInit(): void {
		this.showspinner();
		this.source = new LocalDataSource();
		let data = {
			'skip': this.skip,
			'limit': this.limit
		}
		this.Apiservice.CommonApi('post', Apiconfig.paymentlist, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.hidespinner();
				this.source.load(results.response);
				this.count = results.count;
				this.cd.detectChanges();
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
		this.Apiservice.CommonApi('post', Apiconfig.UserList, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.hidespinner();
			this.source.load(results.response);
			this.count = results.count;
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
		let data = {
			'skip': this.skip,
			'limit': this.limit,
			search: event
		};
		this.Apiservice.CommonApi('post', Apiconfig.paymentlist, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.hidespinner();
				this.source.load(results.response);
				this.count = results.count;
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
		this.source = new LocalDataSource();
		this.settings
		let data = {
		  'skip': this.skip,
		  'limit': this.limit
		}
		this.Apiservice.CommonApi('post', Apiconfig.paymentlist, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.hidespinner();
			this.loadsettings();
			this.source.load(results.response);
			this.count = results.count;
				this.cd.detectChanges();
			} else {
				this.hidespinner();
				return;
			}
		});
	  }
	loadsettings(){
		this.settings = {
			selectMode: 'multi',
			hideSubHeader: true,
			columns: {
				gateway_name: {
					title: 'Gateway Name',
					filter: true
				},
				status: {
					title: 'Status',
					filter: true,
					type: 'html',
					valuePrepareFunction: value => {
						return value == 1 ? "<span class='badge badge-pill badge-info mb-1'>Active</span>" : "<span class='badge badge-pill badge-warning mb-1'>InActive</span>";
					}
				},
			},
			pager: {
				display: true,
				perPage: 10
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
			if (this.router.url == '/app/gateway/paymentgateway/paymentlist') {
				if (this.userPrivilegeDetails && this.userPrivilegeDetails.length > 0) {
					if (this.userPrivilegeDetails[0].status.edit) {
						this.settings.actions.custom.push(
							{
								name: 'editaction',
								type: 'html',
								value: 'Edit',
								title: '<div class="action-btn badge badge-pill badge-secondary mb-1"><i class="glyph-icon simple-icon-note"></i></div>',
							});
					}
				}
			}
		} else {
			this.settings.actions.custom.push(
				{
					name: 'editaction',
					type: 'html',
					value: 'Edit',
					title: '<div class="action-btn badge badge-pill badge-secondary mb-1"><i class="glyph-icon simple-icon-note"></i></div>',
				});
		}
	}
	showspinner() {
		this.spinner = 'block'
	}
	hidespinner() {
		this.spinner = 'none';
	}
}
