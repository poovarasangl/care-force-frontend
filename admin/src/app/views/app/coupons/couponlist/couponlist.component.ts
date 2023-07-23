import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { Apiconfig, AdminService, AuthenticationService } from "../../../../_services";
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';

@Component({
	selector: 'app-couponlist',
	templateUrl: './couponlist.component.html',
	styleUrls: ['./couponlist.component.scss']
})
export class CouponlistComponent implements OnInit {
	settings: any;
	skip: number = 0;
	limit: number = 10;
	default_limit: number = 10;
	count: number = 0;
	addbtn_name: string = 'coupon.add-new';
	source: LocalDataSource = new LocalDataSource();
	addurl: string = '/app/coupons/add';
	editurl: string = '/app/coupons/edit';
	deleteurl: string = Apiconfig.CouponDelete;
	defaultcurrencysymbol: any;
	spinner = 'none';
	curentUser: any;
	userPrivilegeDetails: any;
	add_btn: boolean = true;
	constructor(
		private Apiservice: AdminService,
		private notifications: NotificationsService,
		private cd: ChangeDetectorRef,
		private authService: AuthenticationService,
		private router: Router
	) {
		this.curentUser = this.authService.currentUserValue;
		if (this.curentUser && this.curentUser.user_details && this.curentUser.user_details.role == "subadmin") {
			if (this.router.url == '/app/coupons/list') {
				this.userPrivilegeDetails = this.curentUser.user_details.privileges.filter(x => x.alias == 'coupons');
				if (this.userPrivilegeDetails[0].status.add) {
					this.add_btn = true;
				} else {
					this.add_btn = false;
				}
			}
		}
		this.loadsettings();
	}

	ngOnInit() {
		this.showspinner();
		this.Apiservice.CommonApi('get', Apiconfig.taskerdefaultcurrency, {}).subscribe((results) => {
			if (results.status == 1) {
				this.hidespinner();
				this.defaultcurrencysymbol = results.response.symbol;
			}
			this.Apiservice.CommonApi('post', Apiconfig.CouponList, { 'skip': 0, 'limit': 25 }).subscribe((results: any) => {
				if (results.status === 1) {
					this.hidespinner();
					this.source.load(results.response);
					this.count = results.count;
				} else {
					this.hidespinner();
					return;
				}
			});
		});

	}

	onDeleteChange(event) {
		this.notifications.create('Success', event, NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: true });
		this.ngOnInit();
	}

	onPageChange(event) {
		console.log(event);
	}
	onSearchChange(event) {
		this.showspinner();
		this.Apiservice.CommonApi('post', Apiconfig.CouponList, { 'search': event, 'skip': 0, 'limit': 25 }).subscribe((results: any) => {

			if (results.status === 1) {
				this.hidespinner();
				this.source.load(results.response);
				this.count = results.count;
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
		this.settings
		let data = {
			'skip': this.skip,
			'limit': this.limit
		}
		this.Apiservice.CommonApi('post', Apiconfig.CouponList, data).subscribe((results: any) => {
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
	loadsettings() {
		this.settings = {
			selectMode: 'multi',
			hideSubHeader: true,
			columns: {
				name: {
					title: 'Name',
					filter: true
				},
				amount_percentage: {
					title: 'Amount / Percentage',
					filter: true,
					valuePrepareFunction: (cell, row) => {
						if(row.discount_type == 'Percentage'){
							return cell.toFixed(2)+" %";
						}else{
							return this.defaultcurrencysymbol + cell.toFixed(2)
						}
					}
				},
				discount_type: {
					title: 'Discount Type',
					filter: true,
				},
				code: {
					title: 'Coupon Code',
					filter: true
				},
				status: {
					title: 'Status',
					filter: true,
					type: 'html',
					valuePrepareFunction: value => {
						return value == 1 ? "<span class='badge badge-pill badge-info mb-1'>Active</span>" : "<span class='badge badge-pill badge-warning mb-1'>InActive</span>";
					}
				}
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
				custom: [

				],
			},
		}
		if (this.curentUser && this.curentUser.user_details && this.curentUser.user_details.role == "subadmin") {
			if (this.router.url == '/app/coupons/list') {
				if (this.userPrivilegeDetails && this.userPrivilegeDetails.length > 0) {
					if (this.userPrivilegeDetails[0].status.edit) {
						this.settings.actions.custom.push(
							{
								name: 'editaction',
								type: 'html',
								value: "Edit",
								title: '<div class="action-btn badge badge-pill badge-secondary mb-1"><i class="glyph-icon simple-icon-note"></i></div>',
							});
					}
					if (this.userPrivilegeDetails[0].status.delete) {
						this.settings.actions.custom.push(
							{
								name: 'deleteaction',
								value: "Delete",
								title: '<div class="action-btn badge badge-pill badge-danger mb-1" title="Delete"><i class="glyph-icon simple-icon-trash"></i></div>',
								type: 'html',
							});
					}
				}
			}
		} else {
			this.settings.actions.custom.push(
				{
					name: 'editaction',
					type: 'html',
					value: "Edit",
					title: '<div class="action-btn badge badge-pill badge-secondary mb-1"><i class="glyph-icon simple-icon-note"></i></div>',
				},
				{
					name: 'deleteaction',
					value: "Delete",
					title: '<div class="action-btn badge badge-pill badge-danger mb-1" title="Delete"><i class="glyph-icon simple-icon-trash"></i></div>',
					type: 'html',
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
