import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { Apiconfig, AdminService, AuthenticationService } from "../../../../_services";
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
	selector: 'app-userlist',
	templateUrl: './userlist.component.html',
	styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent implements OnInit {

	settings: any;
	source: LocalDataSource = new LocalDataSource();
	skip: number = 0;
	limit: number = 10;
	count: number = 0;
	addbtn_name: string = 'Add New Agency';
	default_limit: number = 10;
	addurl: string = '/app/agency/add';
	editurl: string = '/app/agency/edit';
	viewurl: string = '/app/agency/wallet';
	deleteurl: string = Apiconfig.UserDelete;
	restoreurl: string = Apiconfig.Userrestore;
	forcedeleteurl: string = Apiconfig.userremove;
	card_details: any[];
	global_status: number;
	global_search: any;
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
		private route: ActivatedRoute,
		private router: Router
	) {
		this.curentUser = this.authService.currentUserValue;
		if (this.curentUser && this.curentUser.user_details && this.curentUser.user_details.role == "subadmin") {
			if (this.router.url == '/app/agency/list') {
				this.userPrivilegeDetails = this.curentUser.user_details.privileges.filter(x => x.alias == 'users');
				if (this.userPrivilegeDetails[0].status.add) {
					this.add_btn = true;
					this.Export_btn = true;
				} else {
					this.Export_btn = false;
					this.add_btn = false;
				}
			}
		}
		this.loadsettings('');
	}
	ngOnInit() {
		this.showspinner();
		let data = {
			'skip': this.skip,
			'limit': this.limit
		}
		this.Apiservice.CommonApi('post', Apiconfig.UserList, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.hidespinner();
				this.loadCard_Details(results.allUsers || 0, results.activeUsers || 0, results.inactiveUsers || 0, results.deletedUsers || 0, results.todayUsers || 0);
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
		this.notifications.create('Success', event, NotificationType.Bare, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
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
		this.global_search = event;
		let data = {
			'skip': this.skip,
			'limit': this.limit,
			'search': event
		}
		if (this.global_status) {
			data['status'] = this.global_status;
		}
		this.Apiservice.CommonApi('post', Apiconfig.UserList, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.hidespinner();
				this.loadCard_Details(results.allUsers || 0, results.activeUsers || 0, results.inactiveUsers || 0, results.deletedUsers || 0, results.todayUsers || 0);
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
		let data = {
			'skip': this.skip,
			'limit': this.limit
		}
		this.Apiservice.CommonApi('post', Apiconfig.UserList, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.hidespinner();
				this.loadCard_Details(results.allUsers || 0, results.activeUsers || 0, results.inactiveUsers || 0, results.deletedUsers || 0, results.todayUsers || 0);
				this.source.load(results.response);
				this.count = results.count;
				this.cd.detectChanges();
			} else {
				this.hidespinner();
				return;
			}
		});
	}

	onheaderCardChange(event) {
		this.showspinner();
		this.source = new LocalDataSource();
		let data = {
			'skip': this.skip,
			'limit': this.limit,
			'status': 0
		}
		if (event == 'all') {
			data.status = 0;
			this.global_status = 0;
		} else if (event == 'active') {
			data.status = 1;
			this.global_status = 1;
		} else if (event == 'inactive') {
			data.status = 2;
			this.global_status = 2;
		} else if (event == 'delete') {
			data.status = 4;
			this.global_status = 4;
		} else if (event == 'today') {
			data.status = 5;
			this.global_status = 5;
		}
		this.loadsettings(event);
		this.Apiservice.CommonApi('post', Apiconfig.UserList, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.hidespinner();
				this.loadCard_Details(results.allUsers || 0, results.activeUsers || 0, results.inactiveUsers || 0, results.deletedUsers || 0, results.todayUsers || 0);
				this.source.load(results.response);
				this.count = results.count;
				this.cd.detectChanges();
			} else {
				this.hidespinner();
				return;
			}
		});
	}

	onRestore(event) {
		this.showspinner();
		if (event && typeof event[0]._id != 'undefined') {
			this.Apiservice.CommonApi('post', Apiconfig.Userrestore, { id: event[0]._id }).subscribe(
				(result) => {
					if (result.status == 1) {
						this.hidespinner();
						this.onheaderCardChange('delete')
					}
				}, (error) => {
					this.hidespinner();
					console.log(error);
				})
		} else if (typeof event == 'undefined') {
			this.hidespinner();
			this.onheaderCardChange('delete')
		}
	}

	onForcedelete(data) {
		this.showspinner();
		let deletedata = [];
		if (data && typeof data[0]._id != 'undefined') {
			deletedata = data.map(x => x._id);
			this.Apiservice.CommonApi('post', Apiconfig.userremove, { ids: deletedata }).subscribe(
				(result) => {
					if (result.status == 1) {
						this.hidespinner();
						this.onheaderCardChange('delete')
					}
				}, (error) => {
					this.hidespinner();
					console.log(error);
				})
		} else if (typeof data == 'undefined') {
			this.hidespinner();
			this.onheaderCardChange('delete')
		}
	}

	loadCard_Details(allUsers, activeUsers, inactiveUsers, deletedUsers, todayUsers) {
		this.card_details = [
			{
				title: 'ALL AGENCY',
				value: allUsers,
				bg_color: 'bg-success',
				icon: 'fa fa-bars',
				click_val: 'all'
			},
			{
				title: 'ACTIVE AGENCY',
				value: activeUsers,
				bg_color: 'bg-danger',
				icon: 'fa fa-check-square-o',
				click_val: 'active'
			},
			{
				title: 'INACTIVE USERS',
				value: inactiveUsers,
				bg_color: 'bg-info',
				icon: 'fa fa-times',
				click_val: 'inactive'
			},
			{
				title: 'DELETED AGENCY',
				value: deletedUsers,
				bg_color: 'bg-dark',
				icon: 'fa fa-trash-o',
				click_val: 'delete'
			},
			{
				title: "TODAY'S AGENCY",
				value: todayUsers,
				bg_color: 'bg-secondary',
				icon: 'fa fa-users',
				click_val: 'today'
			},
		];
	}

	loadsettings(event) {
		if (event == 'delete') {
			this.settings = {
				selectMode: 'multi',
				hideSubHeader: true,
				columns: {
					username: {
						title: 'Agencyname',
						filter: true
					},
					email: {
						title: 'Email',
						filter: true,
						valuePrepareFunction: value => {
							if (this.curentUser && this.curentUser.user_details && this.curentUser.user_details.role == "subadmin") {
								return 'XXXXX@gmail.com';
							} else {
								return value;
							}
						}
					},
					phone: {
						title: 'Phone',
						filter: true,
						valuePrepareFunction: value => {
							if (this.curentUser  && this.curentUser.user_details && this.curentUser.user_details.role == "subadmin") {
								return 'XXXXX-XXXXX';
							} else {
								return value.number;
							}
						}
					},
					status: {
						title: 'Status',
						filter: true,
						type: 'html',
						valuePrepareFunction: value => {
							return value == 1 ? "<span class='badge badge-pill badge-info mb-1'>Active</span>" : "<span class='badge badge-pill badge-danger mb-1'>Deleted</span>";
						}
					},
					updatedAt: {
						title: 'Last Login',
						filter: true,
						valuePrepareFunction: date => {
							if (date) {
								return new DatePipe('en-US').transform(date, 'dd-MMM-yyyy, hh:mm:ss a');
							} else {
								return null;
							}
						}
					}
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
				if (this.router.url == '/app/agency/list') {
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
									name: 'restoreaction',
									value: 'Restore',
									title: '<div class="action-btn badge badge-pill badge-success mb-1"><i class="glyph-icon simple-icon-eye"></i></div>',
									type: 'html',
								});
						}
						if (this.userPrivilegeDetails[0].status.delete) {
							this.settings.actions.custom.push(
								{
									name: 'forcedeleteaction',
									value: 'Permanent Delete',
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
						type: 'html',
						value: 'Edit',
						title: '<div class="action-btn badge badge-pill badge-secondary mb-1"><i class="glyph-icon simple-icon-note"></i></div>',
					},
					{
						name: 'restoreaction',
						value: 'Restore',
						title: '<div class="action-btn badge badge-pill badge-success mb-1"><i class="glyph-icon simple-icon-eye"></i></div>',
						type: 'html',
					},
					{
						name: 'forcedeleteaction',
						value: 'Permanent Delete',
						title: '<div class="action-btn badge badge-pill badge-danger mb-1"><i class="glyph-icon simple-icon-trash"></i></div>',
						type: 'html',
					});
			}
		} else {
			this.settings = {
				selectMode: 'multi',
				hideSubHeader: true,
				columns: {
					username: {
						title: 'Agencyname',
						filter: true
					},
					email: {
						title: 'Email',
						filter: true,
						valuePrepareFunction: value => {
							if (this.curentUser && this.curentUser.user_details.role == "subadmin") {
								return 'XXXXX@gmail.com';
							} else {
								return value;
							}
						}
					},
					phone: {
						title: 'Phone',
						filter: true,
						valuePrepareFunction: value => {
							if (this.curentUser && this.curentUser.user_details.role == "subadmin") {
								return 'XXXXX-XXXXX';
							} else {
								return value.number;
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
					},
					updatedAt: {
						title: 'Last Login',
						filter: true,
						valuePrepareFunction: date => {
							if (date) {
								return new DatePipe('en-US').transform(date, 'dd-MMM-yyyy, hh-mm-ss a');
							} else {
								return null;
							}
						}
					}
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
				if (this.router.url == '/app/agency/list') {
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
						if (this.userPrivilegeDetails[0].status.edit) {
							this.settings.actions.custom.push(
								{
									name: 'viewaction',
									value: 'Wallet Transaction',
									title: '<div class="action-btn badge badge-pill badge-info mb-1" ><i class="glyph-icon simple-icon-wallet"></i></div>',
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
					},
					{
						name: 'viewaction',
						value: 'Wallet Transaction',
						title: '<div class="action-btn badge badge-pill badge-info mb-1" ><i class="glyph-icon simple-icon-wallet"></i></div>',
						type: 'html',
					});
			}
		}

	}

	onexportemit(event) {
		this.showspinner();
		let data = {
			'skip': this.skip,
			'limit': this.limit,
			'format': event,
			'collection': 'users',
			'role': 'user'
		}
		if (this.global_search) {
			data['search'] = this.global_search;
		}
		if (this.global_status) {
			data['status'] = this.global_status;
		} else {
			data['status'] = 0;
		}

		this.Apiservice.CommonApi('post', Apiconfig.exprotmangement, data).subscribe((results: any) => {
			if (results.status === 1) {
				var a = document.createElement("a");
				a.href = results.response;
				a.download = 'users';
				// start download
				a.click();
				this.hidespinner();
				this.notifications.create('Success', results.response, NotificationType.Bare, { theClass: 'outline', timeOut: 3000, showProgressBar: false });
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
