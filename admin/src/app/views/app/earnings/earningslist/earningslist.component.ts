import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { Apiconfig, AdminService, AuthenticationService } from "../../../../_services";
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';

@Component({
	selector: 'app-earningslist',
	templateUrl: './earningslist.component.html',
	styleUrls: ['./earningslist.component.scss']
})
export class EarningslistComponent implements OnInit {
	settings: any;
	skip: number = 0;
	limit: number = 10;
	default_limit: number = 10;
	count: number = 0;
	source: LocalDataSource = new LocalDataSource();
	card_details: any[];
	global_status: number;
	defaultcurrencysymbol: any;
	global_search: any;
	from_date: any;
	to_date: any;
	search_tasker_id: any;
	search_status: any;
	spinner = 'none';
	viewurl: string = '/app/jobs/jobdetails';
	curentUser: any;
	userPrivilegeDetails: any;
	constructor(
		private Apiservice: AdminService,
		private cd: ChangeDetectorRef,
		private notifications: NotificationsService,
		private authService: AuthenticationService,
		private router: Router
	) {
		this.curentUser = this.authService.currentUserValue;
		if (this.curentUser && this.curentUser.user_details && this.curentUser.user_details.role == "subadmin") {
			if (this.router.url == '/app/earnings/earninglist') {
				this.userPrivilegeDetails = this.curentUser.user_details.privileges.filter(x => x.alias == 'earnings');
			}
		}
		this.loadsettings();
	}

	ngOnInit() {
		this.showspinner();
		this.Apiservice.CommonApi('get', Apiconfig.taskerdefaultcurrency, {}).subscribe(
			(results) => {
				this.hidespinner();
				if (results.status == 1) {
					this.defaultcurrencysymbol = results.response.symbol;
				}
			})
		this.source = new LocalDataSource();
		let data = {
			'skip': this.skip,
			'limit': this.limit
		}
		this.Apiservice.CommonApi('post', Apiconfig.Earningslist, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.hidespinner();
				this.loadCard_Details(results.response.invoice.amount || 0, results.response.invoice.service_tax || 0, results.response.invoice.total || 0, results.response.invoice.promo || 0, results.response.invoice.adminEarnings || 0, results.response.invoice.tasker_earning || 0);
				this.source.load(results.response.earnings);
				this.count = results.response.count;
				this.cd.detectChanges();
			} else {
				this.hidespinner();
				return;
			}
		});
	}


	onPageChange(event) {
		this.showspinner();
		this.source = new LocalDataSource();
		let data = {
			'skip': this.limit * (event - 1),
			'limit': this.limit * event
		}

		this.Apiservice.CommonApi('post', Apiconfig.Earningslist, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.hidespinner();
				this.source.load(results.response.earnings);
				this.count = results.response.count;
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
		if (this.global_status) {
			data['status'] = this.global_status;
		}
		this.Apiservice.CommonApi('post', Apiconfig.Earningslist, data).subscribe((results: any) => {

			if (results.status === 1) {
				this.hidespinner();
				this.source.load(results.response.earnings);
				this.count = results.response.count;
				this.cd.detectChanges();
			} else {
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
		this.Apiservice.CommonApi('post', Apiconfig.Earningslist, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.hidespinner();
				this.loadsettings();
				this.source.load(results.response.earnings);
				this.count = results.response.count;
				this.cd.detectChanges();
			} else {
				return;
			}
		});
	}

	onheaderCardChange(event) {
		this.showspinner();
		this.source = new LocalDataSource();
		let data = {
			'skip': this.skip,
			'limit': this.limit
		}
		// if(event == 'all'){
		// 	data.status = 0;
		// 	this.global_status = 0;
		// }else if(event == 'active'){
		// 	data.status = 1;
		// 	this.global_status = 1;
		// }else if(event == 'inactive'){
		// 	data.status = 2;
		// 	this.global_status = 2;
		// }else if(event == 'delete'){
		// 	data.status = 4;
		// 	this.global_status = 4;
		// }else if(event == 'today'){
		// 	data.status = 5;
		// 	this.global_status = 5;
		// }
		this.Apiservice.CommonApi('post', Apiconfig.Earningslist, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.hidespinner();
				this.loadCard_Details(results.response.invoice[0].Total.amount || 0, results.response.invoice[0].Total.service_tax || 0, results.response.invoice[0].Total.total || 0, results.response.invoice[0].Total.promo || 0, results.response.invoice[0].Total.adminEarnings || 0, results.response.invoice[0].Total.tasker_earning || 0);
				this.source.load(results.response.earnings);
				this.count = results.response.count;
				this.cd.detectChanges();
			} else {
				this.hidespinner();
				return;
			}
		});
	}

	loadCard_Details(grandtotal, servicetax, total, promo, siteearnings, taskerearnings) {
		this.card_details = [
			{
				title: 'GRAND TOTAL',
				value: grandtotal,
				bg_color: 'bg-success',
				//click_val : 'all'
			},
			{
				title: 'SERVICE TAX',
				value: servicetax,
				bg_color: 'bg-warning',
				//click_val : 'active'
			},
			{
				title: 'TOTAL',
				value: total,
				bg_color: 'bg-info',
				//click_val : 'inactive'
			},
			{
				title: 'PROMO',
				value: promo,
				bg_color: 'bg-dark'
			},
			{
				title: "SITE EARNINGS",
				value: siteearnings,
				bg_color: 'bg-secondary'
			},
			{
				title: "TASKER EARNINGS",
				value: taskerearnings,
				bg_color: 'bg-primary'
			}
		];
	}

	onsearchfilter(event) {
		this.showspinner();
		this.source = new LocalDataSource();
		let data = {
			'skip': this.skip,
			'limit': this.limit
		}

		data['date'] = {};
		if (event.from) {
			data['date']['from'] = new Date(event.from).setHours(0, 0, 0, 0);
			this.from_date = new Date(event.from).setHours(0, 0, 0, 0);
		}
		if (event.to) {
			data['date']['to'] = new Date(event.to).setHours(23, 59, 59, 0);
			this.to_date = new Date(event.to).setHours(23, 59, 59, 0);
		}

		if (event.tasker != undefined) {
			data['tasker'] = event.tasker;
			this.search_tasker_id = event.tasker;
		}

		if (event.status) {
			data['status'] = parseInt(event.status);
			this.search_status = parseInt(event.status);
		}
		this.Apiservice.CommonApi('post', Apiconfig.Earningslist, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.hidespinner();
				this.loadCard_Details(results.response.invoice.amount || 0, results.response.invoice.service_tax || 0, results.response.invoice.total || 0, results.response.invoice.promo || 0, results.response.invoice.adminEarnings || 0, results.response.invoice.tasker_earning || 0);
				this.source.load(results.response.earnings);
				this.count = results.response.count;
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
				booking_id: {
					title: 'Appointment',
					filter: true
				},
				payee_status: {
					title: 'Tasker Pay Status',
					filter: true
				},
				booking_date: {
					title: 'Booking Date',
					filter: true,

				},
				payout_timestamp: {
					title: 'Paid Date',
					filter: true,
					valuePrepareFunction: value => {
						return value ? value : '-'
					}
				},
				tasker_name: {
					title: 'Tasker Name',
					filter: true
				},
				site_earnings: {
					title: 'Site Earnings',
					filter: true,
					type: 'number',
					valuePrepareFunction: value => {
						return this.defaultcurrencysymbol + value.toFixed(2)
					}
				},
				tasker_earnings: {
					title: 'Tasker Earnings',
					filter: true,
					type: 'number',
					valuePrepareFunction: value => {
						return this.defaultcurrencysymbol + value.toFixed(2)
					}
				},
				service_tax: {
					title: 'Service Tax',
					filter: true,
					type: 'number',
					valuePrepareFunction: value => {
						return this.defaultcurrencysymbol + value.toFixed(2)
					}
				},
				total: {
					title: 'Total Amount',
					filter: true,
					type: 'number',
					valuePrepareFunction: value => {
						return this.defaultcurrencysymbol + value.toFixed(2)
					}
				},
				payout_type: {
					title: 'Payout Mode',
					filter: true,
					valuePrepareFunction: value => {
						return value ? value : '-'
					}
				},
				payout_id: {
					title: 'Payout Id',
					filter: true,
					valuePrepareFunction: value => {
						return value ? value : '-'
					}
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
			if (this.router.url == '/app/earnings/earninglist') {
				if (this.userPrivilegeDetails && this.userPrivilegeDetails.length > 0) {
					if (this.userPrivilegeDetails[0].status.view) {
						this.settings.actions.custom.push(
							{
								name: 'viewaction',
								value: "View",
								title: '<div class="action-btn badge badge-pill badge-info mb-1" title="View"><i class="glyph-icon simple-icon-eye"></i></div>',
								type: 'html',
							});
					}
				}
			}
		} else {
			this.settings.actions.custom.push(
				{
					name: 'viewaction',
					value: "View",
					title: '<div class="action-btn badge badge-pill badge-info mb-1" title="View"><i class="glyph-icon simple-icon-eye"></i></div>',
					type: 'html',
				});
		}
	}

	onexportemit(event){
		this.showspinner();
		let data = {
			'skip': this.skip,
			'limit': this.limit,
			'format': event,
			'collection': 'task',
			'role': 'earnings'
		}
		if(this.global_search){
			data['search'] = this.global_search;
		}
		if(this.global_status){
			data['status'] = this.global_status;
		}else if(this.search_status){
			data['status'] = this.search_status
		}else{
			data['status'] = 0;
		}

		if(this.from_date || this.to_date){
			data['date'] = {}
		}

		if(this.from_date){
			data['date']['from'] = this.from_date;
		}

		if(this.to_date){
			data['date']['to'] = this.to_date;
		}

		if (this.search_tasker_id) {
			data['tasker'] = this.search_tasker_id;
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
