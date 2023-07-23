import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { Apiconfig, AdminService, AuthenticationService } from "../../../../_services";
import { DatePipe } from '@angular/common';
import {Router, ActivatedRoute } from '@angular/router';
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Component({
  selector: 'app-languageslist',
  templateUrl: './languageslist.component.html',
  styleUrls: ['./languageslist.component.scss']
})
export class LanguageslistComponent implements OnInit {

  	settings: any;
	source: LocalDataSource = new LocalDataSource();
	addbtn_name: string = 'pages-translate.add-new';
	addurl: string = '/app/site-page/addtranslate'
	editurl: string = '/app/site-page/edittranslate';
	deleteurl: string = Apiconfig.PageDelete;
	spinner = 'none';
	curentUser: any;
	userPrivilegeDetails: any;
	add_btn: boolean = true;
  constructor(
    private Apiservice: AdminService,
	private router: Router,
	private ActivatedRoute : ActivatedRoute,
	  private notifications: NotificationsService,
	  private authService: AuthenticationService,
    ) {
	  this.curentUser = this.authService.currentUserValue;
	  if (this.curentUser && this.curentUser.user_details && this.curentUser.user_details.role == "subadmin") {
		  if (this.router.url == '/app/site-page/languages') {
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
    const id = this.ActivatedRoute.snapshot.paramMap.get('id');
		this.Apiservice.CommonApi('post', Apiconfig.PageLanguages, { 'id': id, 'skip': 0, 'limit': 25 }).subscribe((results: any) => {
      if (results) {
		  this.hidespinner();
        if(results.response != ""){
			this.hidespinner();
          this.source.load(results.response);
        }
			} else {
		  this.hidespinner();				
				return;
			}
		});
	}
	
	onDeleteChange(event) {
		const id = this.ActivatedRoute.snapshot.paramMap.get('id');
	  	this.notifications.create('Success', event, NotificationType.Success, { theClass: 'outline', timeOut: 3000, showProgressBar: true });		
	  	this.router.navigate(['/app/site-page/languages/',id])
	}
	onViewChange(event) {
    console.log(event);
	}
	onPageChange(event) {
		console.log(event);
	}
	onSearchChange(event) {
		this.showspinner();
		const id = this.ActivatedRoute.snapshot.paramMap.get('id');
		this.Apiservice.CommonApi('post', Apiconfig.PageLanguages, { 'id':id,'search': event,'skip': 0, 'limit': event }).subscribe((results: any) => {
      if (results) {
		  this.hidespinner();
        if(results.response != ""){
          this.source.load(results.response);
        }
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
    var id = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
		this.Apiservice.CommonApi('post', Apiconfig.PageLanguages, { 'id':id,'skip': 0, 'limit': event }).subscribe((results: any) => {
      if (results) {
        if(results.response != ""){
			this.hidespinner();
          this.source.load(results.response);
        }
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
			if (this.router.url == '/app/site-page/languages') {
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
					if (this.userPrivilegeDetails[0].status.delete) {
						this.settings.actions.custom.push(
							{
								name: 'deleteaction',
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
					title: '<div class="action-btn badge badge-pill badge-secondary mb-1"><i class="glyph-icon simple-icon-note"></i></div>',
				},
				{
					name: 'deleteaction',
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
