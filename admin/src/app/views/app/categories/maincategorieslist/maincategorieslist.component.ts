import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { AdminService, Apiconfig, AuthenticationService } from 'src/app/_services';
import { environment } from "src/environments/environment";

@Component({
	selector: 'app-maincategorieslist',
	templateUrl: './maincategorieslist.component.html',
	styleUrls: ['./maincategorieslist.component.scss']
})
export class MaincategorieslistComponent implements OnInit {

	settings: any;
	skip: number = 0;
	limit: number = 10;
	default_limit: number = 10;
	count: number = 0;
	source: LocalDataSource = new LocalDataSource();
	editurl: string = '/app/categories/mainedit/';
	viewurl: string = '/app/categories/mainedit/';
	addurl: string = '/app/categories/maincat-add';
	addbtn_name: string = 'categories.add-new'
	deleteurl: string = Apiconfig.categorydelete;
	spinner = 'none';
	curentUser: any;
	userPrivilegeDetails: any;
	add_btn: boolean = true;
	Export_btn: boolean = true;
	constructor(
		private Apiservice: AdminService,
		private notifications: NotificationsService,
		private cd: ChangeDetectorRef,
		private authService: AuthenticationService,
		private _domSanitizer: DomSanitizer,
		private router: Router
	) {
		this.curentUser = this.authService.currentUserValue;
		if (this.curentUser && this.curentUser.user_details && this.curentUser.user_details.role == "subadmin") {
			if (this.router.url == '/app/categories/mainlist') {
				this.userPrivilegeDetails = this.curentUser.user_details.privileges.filter(x => x.alias == 'categories');
				if (this.userPrivilegeDetails[0].status.add) {
					this.add_btn = true;
					this.Export_btn = true;
				} else {
					this.Export_btn = false;
					this.add_btn = false;
				}
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
		this.Apiservice.CommonApi('post', Apiconfig.categorylist, data).subscribe((results: any) => {
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
		this.Apiservice.CommonApi('post', Apiconfig.categorylist, data).subscribe((results: any) => {
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
		this.Apiservice.CommonApi('post', Apiconfig.categorylist, data).subscribe((results: any) => {
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
		this.Apiservice.CommonApi('post', Apiconfig.categorylist, data).subscribe((results: any) => {
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
					title: 'Category Name',
					filter: true
				},
				image: {
					title: 'Category Image',
					type: 'html',
					valuePrepareFunction: (image) => {
						return this._domSanitizer.bypassSecurityTrustHtml(`<img style="background: black;" src="${environment.apiUrl + image}" height="70" width="70">`);
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
			if (this.router.url == '/app/categories/mainlist') {
				if (this.userPrivilegeDetails && this.userPrivilegeDetails.length > 0) {
					if (this.userPrivilegeDetails[0].status.edit) {
						this.settings.actions.custom.push(
							{
								name: 'editaction',
								value: 'Edit',
								type: 'html',
								title: '<div class="action-btn badge badge-pill badge-secondary mb-1"><i class="glyph-icon simple-icon-note"></i></div>',
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
					name: 'editaction',
					value: 'Edit',
					type: 'html',
					title: '<div class="action-btn badge badge-pill badge-secondary mb-1"><i class="glyph-icon simple-icon-note"></i></div>',
				},
				{
					name: 'deleteaction',
					value: 'Delete',
					title: '<div class="action-btn badge badge-pill badge-danger mb-1"><i class="glyph-icon simple-icon-trash"></i></div>',
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
