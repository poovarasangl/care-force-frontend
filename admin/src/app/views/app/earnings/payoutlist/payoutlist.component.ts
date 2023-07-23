import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { Apiconfig, AdminService, AuthenticationService } from "../../../../_services";
import { AnyARecord } from 'dns';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
	selector: 'app-payoutlist',
	templateUrl: './payoutlist.component.html',
	styleUrls: ['./payoutlist.component.scss']
})
export class PayoutlistComponent implements OnInit {

	settings: any;
	skip: number = 0;
	limit: number = 10;
	default_limit: number = 10;
	count: number = 0;
	source: LocalDataSource = new LocalDataSource();
	viewurl: string = '/app/earnings/viewearnings';
	billingcycledata: any;
	defaultcurrencysymbol: any;
	spinner = 'none';
	curentUser: any;
	userPrivilegeDetails: any;
	constructor(
		private Apiservice: AdminService,
		private cd: ChangeDetectorRef,
		private route: Router,
		private authService: AuthenticationService,
	) {
		this.curentUser = this.authService.currentUserValue;
		if (this.curentUser && this.curentUser.user_details && this.curentUser.user_details.role == "subadmin") {
			if (this.route.url == '/app/earnings/payoutlist') {
				this.userPrivilegeDetails = this.curentUser.user_details.privileges.filter(x => x.alias == 'earnings');
			}
		}
		this.loadsettings();
	}

	ngOnInit() {
		this.showspinner();
		this.Apiservice.CommonApi('get', Apiconfig.taskerdefaultcurrency, {}).subscribe(
			(results)=>{
			  if(results.status == 1){
				  this.hidespinner();
				this.defaultcurrencysymbol = results.response.symbol;
			  } else {
				  this.hidespinner();
			  }
		})

		this.source = new LocalDataSource();
		let data = {
			'skip': this.skip,
			'limit': this.limit
		}
		this.Apiservice.CommonApi('post', Apiconfig.Payoutlist, data).subscribe((results: any) => {
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

	onPageChange(event) {
		this.showspinner();
		this.source = new LocalDataSource();
		let data = {
			'skip': this.limit * (event - 1),
			'limit': this.limit * event
		}
		this.Apiservice.CommonApi('post', Apiconfig.Payoutlist, data).subscribe((results: any) => {
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
			'search': event
		}

		if (this.billingcycledata) {
			data['data'] = this.billingcycledata;
		}
		this.Apiservice.CommonApi('post', Apiconfig.Payoutlist, data).subscribe((results: any) => {

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
		let data = {
			'skip': this.skip,
			'limit': event
		}
		this.Apiservice.CommonApi('post', Apiconfig.Payoutlist, data).subscribe((results: any) => {
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
	onPayoutFilter(event) {
		this.showspinner();
		this.source = new LocalDataSource();
		let data = {
			'skip': this.skip,
			'limit': this.limit,
			'data': event
		}
		if (event) {
			this.billingcycledata = event;
		}

		this.Apiservice.CommonApi('post', Apiconfig.Payoutlist, data).subscribe((results: any) => {
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

	ontaskerChange(event){
		if(this.billingcycledata){
			this.route.navigate([this.viewurl, { queryParams: {id:event._id, id2:this.billingcycledata}}]);
		}else{
			this.route.navigate([this.viewurl,event._id]);
		}
		
	}

	loadsettings() {
		this.settings = {
			selectMode: 'multi',
			hideSubHeader: true,
			columns: {
				tasker_name: {
					title: 'Tasker Name',
					filter: true
				},
				total_appointment: {
					title: 'Total Appointment',
					filter: true
				},
				total: {
					title: 'Total',
					filter: true,
					valuePrepareFunction: value => {
						return this.defaultcurrencysymbol+value.toFixed(2)
					}
				},
				coupon: {
					title: 'Coupon',
					filter: true,
					valuePrepareFunction: value => {
						return this.defaultcurrencysymbol+value.toFixed(2)
					}

				},
				servicetax: {
					title: 'Service Tax',
					filter: true,
					valuePrepareFunction: value => {
						return this.defaultcurrencysymbol+value.toFixed(2)
					}
				},
				net_total: {
					title: 'Net Total',
					filter: true,
					valuePrepareFunction: (value) => {
						return this.defaultcurrencysymbol+value.toFixed(2)
					}
				},
				extra_amount: {
					title: 'Material',
					filter: true,
					valuePrepareFunction: value => {
						return this.defaultcurrencysymbol+value.toFixed(2)
					}
				},
				grandtotal: {
					title: 'Grand Total',
					filter: true,
					valuePrepareFunction: value => {
						return this.defaultcurrencysymbol+value.toFixed(2)
					}
				},
				admin_commission: {
					title: 'Site Earnings',
					filter: true,
					valuePrepareFunction: value => {
						return this.defaultcurrencysymbol+value.toFixed(2)
					}
				},
				tasker_earnings: {
					title: 'Tasker Earnings',
					filter: true,
					valuePrepareFunction: value => {
						return this.defaultcurrencysymbol+value.toFixed(2)
					}
				},

			},
			pager: {
				display: true,
				perPage: this.default_limit
			},
			actions: {
				add: false,
				edit: false,
				delete: false,
				columnTitle: 'Actions',
				class: 'action-column',
				position: 'right',
				custom: [],
			},
		}
		if (this.curentUser && this.curentUser.user_details && this.curentUser.user_details.role == "subadmin") {
			if (this.route.url == '/app/earnings/payoutlist') {
				if (this.userPrivilegeDetails && this.userPrivilegeDetails.length > 0) {
					if (this.userPrivilegeDetails[0].status.view) {
						this.settings.actions.custom.push(
							{
								name: 'taskeraction',
								value: "View",
								title: '<div class="action-btn badge badge-pill badge-info mb-1" title="Wallet"><i class="glyph-icon simple-icon-eye"></i></div>',
								type: 'html',
							});
					}
				}
			}
		} else {
			this.settings.actions.custom.push(
				{
					name: 'taskeraction',
					value: "View",
					title: '<div class="action-btn badge badge-pill badge-info mb-1" title="Wallet"><i class="glyph-icon simple-icon-eye"></i></div>',
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
