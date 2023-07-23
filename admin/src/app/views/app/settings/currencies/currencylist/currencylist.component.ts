import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { StarButtonComponent } from 'src/app/common/star-button.component';
import { AdminService, Apiconfig } from 'src/app/_services';

@Component({
	selector: 'app-currencylist',
	templateUrl: './currencylist.component.html',
	styleUrls: ['./currencylist.component.scss']
})
export class CurrencylistComponent implements OnInit {
	settings: any;
	source: LocalDataSource = new LocalDataSource();
	skip: number = 0;
	limit: number = 10;
	count: number = 0;
	default_limit: number = 10;
	editurl: string = '/app/settings/currencies/currencyedit';
	viewurl: string = '/app/settings/currencies/currencyedit';
	addurl: string = '/app/settings/currencies/currencyadd';
	addbtn_name: string = 'currency.add-new'
	deleteurl: string = Apiconfig.currencydelete;
	spinner = 'none';
	constructor(private Apiservice: AdminService,
		private notifications: NotificationsService,
		private cd: ChangeDetectorRef,
	) {
		this.loadsettings();
	}

	ngOnInit(): void {
		this.showspinner();
		this.source = new LocalDataSource();
		let data = {
			'skip': this.skip,
			'limit': this.limit
		}
		this.Apiservice.CommonApi('post', Apiconfig.getCurrenciesList, data).subscribe(
			(results: any) => {
				this.hidespinner();
				if (results.status === 1) {
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
		//  this.notifications.create('Error', event, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
		this.ngOnInit();
	}
	onPageChange(event) {
		this.showspinner();
		this.source = new LocalDataSource();
		let data = {
			'skip': this.limit * (event - 1),
			'limit': this.limit * event
		}
		this.Apiservice.CommonApi('post', Apiconfig.getCurrenciesList, data).subscribe((results: any) => {
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
		this.Apiservice.CommonApi('post', Apiconfig.getCurrenciesList, data).subscribe(
			(results: any) => {
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
		this.default_limit = event;
		this.skip = 0;
		this.source = new LocalDataSource();
		this.settings
		let data = {
			'skip': this.skip,
			'limit': this.limit
		}
		this.Apiservice.CommonApi('post', Apiconfig.getCurrenciesList, data).subscribe((results: any) => {
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
					title: 'Currency Name',
					filter: true
				},
				code: {
					title: 'Currency Code',
					filter: true
				},
				default: {
					title: 'Default',
					filter: false,
					type: "custom",
					renderComponent: StarButtonComponent,
					sort: false,
					editable: true,
					onComponentInitFunction: (instance: any) => {
						instance.save.subscribe(row => {
							this.defaultcurrency(row._id);
							//this.changedValue[row.content] = row.value;
						});
					}
				},

				symbol: {
					title: 'Currency Symbol',
					filter: true,
					type: 'number',
					// valuePrepareFunction: value =>{
					// 	return value.number
					// }
				},
				value: {
					title: 'Currency Value',
					filter: true
				},
				// default_currency: {
				// 	title: 'Default',
				// 	filter: true
				// },
				status: {
					title: 'Status',
					filter: true,
					type: 'html',
					valuePrepareFunction: value => {
						return value === 1 ? "<span class='badge badge-pill badge-info mb-1'>Publish</span>" : "<span class='badge badge-pill badge-warning mb-1'>Unpublish</span>";
					}
				},
				// updatedAt: {
				// 	title: 'Last Login',
				// 	filter: true,
				// 	valuePrepareFunction: date => {
				// 		if (date) {
				// 			return new DatePipe('en-US').transform(date, 'dd-MMM-yyyy, hh-mm a');
				// 		} else {
				// 			return null;
				// 		}
				// 	}
				// }
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
						name: 'editaction',
						type: 'html',
						value: 'Edit',
						title: '<div class="action-btn badge badge-pill badge-secondary mb-1"><i class="glyph-icon simple-icon-note"></i></div>',
					},
					{
						name: 'deleteaction',
						value: 'Delete',
						title: '<div class="action-btn badge badge-pill badge-danger mb-1" title="Delete"><i class="glyph-icon simple-icon-trash"></i></div>',
						type: 'html',
					},
					// {
					// 	name: 'viewaction',
					// 	title: '<div class="action-btn badge badge-pill badge-info mb-1" title="View"><i class="glyph-icon simple-icon-eye"></i></div>',
					// 	type: 'html',
					// }
				],
			},
		}
	}
	defaultcurrency(id) {
		this.showspinner();
		id = { id };
		this.Apiservice.CommonApi('post', Apiconfig.defaultcurrency, id).subscribe((result) => {
			if (result.status == 1) {
				this.hidespinner();
				this.ngOnInit();
				this.notifications.create('Success', 'Default Currency changed successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: true });
			} else {
				this.hidespinner();
				this.notifications.create('Error', 'Error in Updating changing default Currency', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
			}
		})
	}
	showspinner() {
		this.spinner = 'block'
	}
	hidespinner() {
		this.spinner = 'none';
	}
}
