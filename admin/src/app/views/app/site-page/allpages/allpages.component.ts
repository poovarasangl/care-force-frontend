import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { Apiconfig, AdminService, AuthenticationService } from "../../../../_services";
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Component({
	selector: 'app-allpages',
	templateUrl: './allpages.component.html',
	styleUrls: ['./allpages.component.scss']
})
export class AllpagesComponent implements OnInit {

	settings: any;
	skip: number = 0;
	limit: number = 10;
	default_limit: number = 10;
	count : number = 0;
	source: LocalDataSource = new LocalDataSource();
	addbtn_name: string = 'site-pages.add-new';
	addurl: string = '/app/site-page/addpage';
	editurl: string = '/app/site-page/editpage';
	viewurl: string = '/app/site-page/languages';
	deleteurl: string = Apiconfig.PageDelete;
	spinner = 'none';
	curentUser: any;
	userPrivilegeDetails: any;
	add_btn: boolean = true;
  constructor(
    private Apiservice: AdminService,
	private router: Router,
	private notifications: NotificationsService,
	private cd: ChangeDetectorRef,
	  private authService: AuthenticationService,
    ) {
	  this.curentUser = this.authService.currentUserValue;
	  console.log(this.curentUser);

	  if (this.curentUser && this.curentUser.user_details && this.curentUser.user_details.role == "subadmin") {
		  if (this.router.url == '/app/site-page/allpages') {
			  this.userPrivilegeDetails = this.curentUser.user_details.privileges.filter(x => x.alias == 'page');
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
		this.Apiservice.CommonApi('post', Apiconfig.PagesList, { 'skip': 0, 'limit': 25 }).subscribe((results: any) => {
      if (results) {
		  this.hidespinner();
				this.source.load(results.response);
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
		this.Apiservice.CommonApi('post', Apiconfig.PagesList, data).subscribe((results: any) => {
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
		this.Apiservice.CommonApi('post', Apiconfig.PagesList, {'search': event, 'skip': 0, 'limit': 25 }).subscribe((results: any) => {
     
      if (results) {
		  this.hidespinner();
				this.source.load(results.response);
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
		this.settings
		let data = {
		  'skip': this.skip,
		  'limit': this.limit
		}
		this.Apiservice.CommonApi('post', Apiconfig.PagesList, data).subscribe((results: any) => {
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
			name: {
				title: 'Page Name',
				filter: true
			},
			createdAt: {
				title: 'Published On',
				filter: true,
				valuePrepareFunction: date => {
					if (date) {
						return new DatePipe('en-US').transform(date, 'dd-MMM-yyyy, hh-mm a');
					} else {
						return null;
					}
				}
			},
			category: {
				title: 'Category',
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
		if (this.router.url == '/app/users/list') {
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
							title: '<div class="action-btn badge badge-pill badge-danger mb-1"><i class="glyph-icon simple-icon-trash"></i></div>',
							type: 'html',
						});
				}
				if (this.userPrivilegeDetails[0].status.view) {
					this.settings.actions.custom.push(
						{
							name: 'viewaction',
							value: "Languages",
							title: '<div class="action-btn badge badge-pill badge-info mb-1"><i class="glyph-icon simple-icon-eye"></i></div>',
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
				title: '<div class="action-btn badge badge-pill badge-danger mb-1"><i class="glyph-icon simple-icon-trash"></i></div>',
				type: 'html',
			},
			{
				name: 'viewaction',
				value: "Languages",
				title: '<div class="action-btn badge badge-pill badge-info mb-1"><i class="glyph-icon simple-icon-eye"></i></div>',
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
