import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { Apiconfig, AdminService } from "../../../../_services";
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Component({
	selector: 'app-contact',
	templateUrl: './contactlist.component.html',
	styleUrls: ['./contactlist.component.scss']
})
export class ContactlistComponent implements OnInit {

	settings: any;
	skip: number = 0;
	limit: number = 10;
	default_limit : number = 10;
	source: LocalDataSource = new LocalDataSource();
	editurl: string = '/app/contact/contact-edit';
	viewurl: string = '/app/contact/contact-edit';
	addurl: string = '/app/contact/contact-add';
	addbtn_name : string = 'contact.add-new'
	deleteurl: string = Apiconfig.ContactDelete;
	spinner = 'none';
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
					title: 'Username',
					filter: true
				},
				email: {
					title: 'Email',
					filter: true
				},
				mobile: {
					title: 'Mobile',
					filter: true
				},
				subject: {
					title: 'Subject',
					filter: true,
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
				custom: [
					// {
					// 	name: 'editaction',
					// 	type: 'html',
					// 	title: '<div class="action-btn badge badge-pill badge-secondary mb-1"><i class="glyph-icon simple-icon-note"></i></div>',
					// },
					{
						name: 'deleteaction',
						value: "Delete",
						title: '<div class="action-btn badge badge-pill badge-danger mb-1" title="Delete"><i class="glyph-icon simple-icon-trash"></i></div>',
						type: 'html',
					},
					{
						name: 'viewaction',
						value: "View",
						title: '<div class="action-btn badge badge-pill badge-info mb-1" title="View"><i class="glyph-icon simple-icon-eye"></i></div>',
						type: 'html',
					}
				],
			},
		}
	}
	ngOnInit(): void {
		this.showspinner();
		this.source = new LocalDataSource();
		let data = {
			'skip': this.skip,
			'limit': this.limit
		}
		this.Apiservice.CommonApi('post', Apiconfig.ContactsList, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.hidespinner();
				this.source.load(results.response);
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
		console.log(event);
	}
	onSearchChange(event) {
		this.showspinner();
		this.source = new LocalDataSource();
		let data = {
			'skip': this.skip,
			'limit': this.limit,
			search: event
		};
		this.Apiservice.CommonApi('post', Apiconfig.ContactsList, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.hidespinner();
				this.source.load(results.response);
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
		let data = {
			'skip': this.skip,
			'limit': this.limit
		}
		this.Apiservice.CommonApi('post', Apiconfig.ContactsList, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.hidespinner();
				this.source.load(results.response);
				this.cd.detectChanges();
			} else {
				this.hidespinner();
				return;
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
