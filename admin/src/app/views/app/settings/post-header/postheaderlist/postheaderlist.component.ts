import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { AdminService, Apiconfig } from 'src/app/_services';
import { environment } from "src/environments/environment";

@Component({
	selector: 'app-postheaderlist',
	templateUrl: './postheaderlist.component.html',
	styleUrls: ['./postheaderlist.component.scss']
})
export class PostheaderlistComponent implements OnInit {

	settings: any;
	skip: number = 0;
	limit: number = 10;
	default_limit: number = 10;
	count : number = 0;
	source: LocalDataSource = new LocalDataSource();
	editurl: string = '/app/settings/postheader/postheaderedit';
	viewurl: string = '/app/settings/postheader/postheaderedit';
	addurl: string = '/app/settings/postheader/postheaderadd';
	addbtn_name: string = 'postheader.add-new'
	deleteurl: string = Apiconfig.deletePostHeader;
	spinner = 'none';

	constructor(
		private Apiservice: AdminService,
		private notifications: NotificationsService,
		private cd: ChangeDetectorRef,
		private _domSanitizer: DomSanitizer
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
		this.Apiservice.CommonApi('post', Apiconfig.getPostHeaderList, data).subscribe((results: any) => {
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
		this.Apiservice.CommonApi('post', Apiconfig.getPostHeaderList, data).subscribe((results: any) => {
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
		this.settings
		let data = {
		  'skip': this.skip,
		  'limit': this.limit
		}
		this.Apiservice.CommonApi('post', Apiconfig.getPostHeaderList, data).subscribe((results: any) => {
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
			title: {
				title: 'Title',
				filter: true
			},
			image: {
				title: 'Image',
				type: 'html',
				valuePrepareFunction: (image) => {
					return this._domSanitizer.bypassSecurityTrustHtml(`<img src="${environment.apiUrl + image}" height="70" width="70">`);
				},
			},
			status: {
				title: 'Status',
				filter: true,
				type: 'html',
				valuePrepareFunction: value => {
					return value == 1 ? "<span class='badge badge-pill badge-info mb-1'>Publish</span>" : "<span class='badge badge-pill badge-warning mb-1'>Unpublish</span>";
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
	showspinner() {
		this.spinner = 'block'
	}
	hidespinner() {
		this.spinner = 'none';
	}
}
