import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { Apiconfig, AdminService } from "../../../../../_services";
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { CheckboxComponent } from 'src/app/common/checkbox.component';

@Component({
  selector: 'app-documentlist',
  templateUrl: './documentlist.component.html',
  styleUrls: ['./documentlist.component.scss']
})
export class DocumentlistComponent implements OnInit {

  settings: any;
	skip: number = 0;
	limit: number = 10;
	default_limit : number = 10;
	source: LocalDataSource = new LocalDataSource();
	editurl: string = 'app/experts/document/documentedit';
	addurl: string = 'app/experts/document/documentadd';
	deleteurl: string = Apiconfig.documentdelete;
	addbtn_name: string = 'document.add-new'

	constructor(
		private Apiservice: AdminService,
		private notifications: NotificationsService,
		private cd: ChangeDetectorRef
	) {
		this.settings = {
			selectMode: 'multi',
			hideSubHeader: true,
			columns: {
				name: {
					title: 'Name',
					filter: true
				},
				status: {
					title: 'Status',
					filter: true,
					type: 'html',
					valuePrepareFunction: value => {
						return value == 1 ? "<span class='badge badge-pill badge-info mb-1'>Publish</span>" : "<span class='badge badge-pill badge-warning mb-1'>Unpublish</span>";
					}
				},
				mandatory: {
							title: 'Mandatory',
							filter: true,
							type: 'html',
							valuePrepareFunction: value => {
								return value == 1 ? "<span class='badge badge-pill badge-info mb-1'>Yes</span>" : "<span class='badge badge-pill badge-warning mb-1'>No</span>";
							}
				},
				stripe: {
					title: 'Stripe',
					filter: false,
					type: "custom",
					renderComponent: CheckboxComponent,
					sort: false,
					editable: true,
					onComponentInitFunction: (instance: any) => {
					  instance.save.subscribe(row => {
						 this.stripevalue(row._id);					  
						//this.changedValue[row.content] = row.value;
					  });
					}
				},
						
			},
			pager: {
				display: true,
				perPage: 10
			},
			actions: {
				add: false,
				edit: false,
				delete: false,
				columnTitle: 'Actions',
				class: 'action-column',
				position: 'right',
				custom: [
					{
						name: 'editaction',
						type: 'html',
						value: "Edit",
						title: '<div class="action-btn badge badge-pill badge-secondary mb-1"><i class="glyph-icon simple-icon-note"></i></div>',
					},
					// {
					// 	name: 'deleteaction',
					// 	title: '<div class="action-btn badge badge-pill badge-danger mb-1" title="Delete"><i class="glyph-icon simple-icon-trash"></i></div>',
					// 	type: 'html',
					// },
					// {
					// 	name: 'viewaction',
					// 	title: '<div class="action-btn badge badge-pill badge-info mb-1" title="View"><i class="glyph-icon simple-icon-eye"></i></div>',
					// 	type: 'html',
					// }
				],
			},
		}
	}
	ngOnInit(): void {
		this.source = new LocalDataSource();
		let data = {
			'skip': this.skip,
			'limit': this.limit
		}
		this.Apiservice.CommonApi('post', Apiconfig.documentslist, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.source.load(results.response);
				this.cd.detectChanges();
			} else {
				return;
			}
		});
	}

	onDeleteChange(event) {
		this.notifications.create('Success', event, NotificationType.Success, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
		this.ngOnInit();
	}
	onPageChange(event) {
		console.log(event);
	}

	stripevalue(event){
		console.log(event)
		let data = {
			'id': event
		}
		this.Apiservice.CommonApi('post', Apiconfig.documentstripe, data).subscribe((data: any) => {
			if (data.status === 1) {
				this.notifications.create('Success', data.message, NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
            	this.ngOnInit();
			} else {
				this.ngOnInit();
				this.notifications.create('Error', data.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: false });
			}
		});
	}
	
	onSearchChange(event) {
		this.source = new LocalDataSource();
		let data = {
			'skip': this.skip,
			'limit': this.limit,
			search: event
		};
		this.Apiservice.CommonApi('post', Apiconfig.documentslist, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.source.load(results.response);
				this.cd.detectChanges();
			} else {
				return;
			}
		});
	}
	onitemsPerPageChange(event) {
		this.limit = event;
		this.skip = 0;
		this.default_limit = event;
		this.source = new LocalDataSource();
		let data = {
			'skip': this.skip,
			'limit': this.limit
		}
		this.Apiservice.CommonApi('post', Apiconfig.documentslist, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.source.load(results.response);
				this.cd.detectChanges();
			} else {
				return;
			}
		});
	}

}
