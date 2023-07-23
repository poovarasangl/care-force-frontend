import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { Apiconfig, AdminService, AuthenticationService } from "../../../../../_services";
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { VerifyiconComponent } from "src/app/common/verify-icon.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-taskerslist',
  templateUrl: './taskerslist.component.html',
  styleUrls: ['./taskerslist.component.scss']
})
export class TaskerslistComponent implements OnInit {

  settings: any;
  skip: number = 0;
  limit: number = 10;
  default_limit: number = 10;
  count: number = 0;
  source: LocalDataSource = new LocalDataSource();
  editurl: string = '/app/experts/taskers/taskeredit';
  addurl: string = '/app/experts/addnewtasker';
  viewurl: string = '';
  // verifyurl: string = Apiconfig.taskerstatusupdate;
  deleteurl: string = Apiconfig.taskersdelete;
  restoreurl: string = Apiconfig.taskersrestore;
	forcedeleteurl: string = Apiconfig.taskerremove;
  addbtn_name: string = 'tasker.add-new'
  card_details: any[];
  global_status: number;
  global_search: any;
  expertsdatas: any;
  verifydatas = {
    id: '',
    status: ''
  }
  curentUser: any;
  userPrivilegeDetails: any;
  add_btn: boolean = true;
  Export_btn: boolean = true;
  constructor(
    private Apiservice: AdminService,
    private notifications: NotificationsService,
    private authService: AuthenticationService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {
    this.curentUser = this.authService.currentUserValue;
    if (this.curentUser && this.curentUser.user_details && this.curentUser.user_details.role == "subadmin") {
      if (this.router.url == '/app/experts/taskers/taskerlist') {
        this.userPrivilegeDetails = this.curentUser.user_details.privileges.filter(x => x.alias == 'tasker');
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
  ngOnInit(): void {
    this.source = new LocalDataSource();
    let data = {
      'skip': this.skip,
      'limit': this.limit,
      'status': 0
    }
    this.Apiservice.CommonApi('post', Apiconfig.expertslist, data).subscribe((results: any) => {
      if (results.status === 1) {
        this.expertsdatas = results.response;
        this.loadCard_Details(results.allTaskers || 0, results.activeUsers || 0, results.unVerifiedTaskers || 0, results.documentPendingTaskers || 0, results.todayTaskers || 0, results.deletedTaskers || 0);
        this.source.load(results.response);
        this.count = results.count;
        this.cd.detectChanges();
      } else {
        return;
      }
    });
  }
  onRestore(event) {
		if (event && typeof event[0]._id != 'undefined') {
			this.Apiservice.CommonApi('post', Apiconfig.taskersrestore, { id: event[0]._id }).subscribe(
				(result) => {
					if (result.status == 1) {
						this.onheaderCardChange('delete')
					}
				}, (error) => {
					console.log(error);
				})
		} else if (typeof event == 'undefined') {

		}
	}

	onForcedelete(data) {
		let deletedata = [];
		if (data && typeof data[0]._id != 'undefined') {
			deletedata = data.map(x => x._id);
			this.Apiservice.CommonApi('post', Apiconfig.taskerremove, { ids: deletedata }).subscribe(
				(result) => {
					if (result.status == 1) {
						this.onheaderCardChange('delete')
					}
				}, (error) => {
					console.log(error);
				})
		} else if (typeof data == 'undefined') {
			this.onheaderCardChange('delete')
		}
	}
  onDeleteChange(event) {
    this.notifications.create('Success', event, NotificationType.Success, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
    this.ngOnInit();
  }
  onPageChange(event) {
    this.source = new LocalDataSource();
    let data = {
      'skip': this.limit * (event - 1),
      'limit': this.limit * event,
      'status': this.global_status

    }
    this.Apiservice.CommonApi('post', Apiconfig.expertslist, data).subscribe((results: any) => {
      if (results.status === 1) {
        this.loadCard_Details(results.allTaskers || 0, results.verifiedTaskers || 0, results.unVerifiedTaskers || 0, results.documentPendingTaskers || 0, results.todayTaskers || 0, results.deletedTaskers || 0);
        this.source.load(results.response);
        this.count = results.count;
        this.cd.detectChanges();
      } else {
        return;
      }
    });
  }
  onSearchChange(event) {
    this.source = new LocalDataSource();
    this.global_search = event;
    let data = {
      'skip': this.skip,
      'limit': this.limit,
      'search': event
    };
    if (this.global_status) {
      data['status'] = this.global_status;
    }
    this.Apiservice.CommonApi('post', Apiconfig.expertslist, data).subscribe((results: any) => {
      if (results.status === 1) {
        this.loadCard_Details(results.allTaskers || 0, results.verifiedTaskers || 0, results.unVerifiedTaskers || 0, results.documentPendingTaskers || 0, results.todayTaskers || 0, results.deletedTaskers || 0);
        this.source.load(results.response);
        this.count = results.count;
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
    this.limit = event;
    this.skip = 0;
    this.default_limit = event;
    this.source = new LocalDataSource();
    this.settings
    let data = {
      'skip': this.skip,
      'limit': this.limit,
      'status': this.global_status
    }
    this.Apiservice.CommonApi('post', Apiconfig.expertslist, data).subscribe((results: any) => {
      if (results.status === 1) {
        this.loadsettings(event);
        this.source.load(results.response);
        this.count = results.count;
        this.cd.detectChanges();
      } else {
        return;
      }
    });
  }
  // onitemsPerPageChange(event) {
  //   this.limit = event;
  //   this.default_limit = event;
  //   this.source = new LocalDataSource();
  //   let data = {
  //     'skip': this.skip,
  //     'limit': this.limit
  //   }
  //   this.Apiservice.CommonApi('post', Apiconfig.expertslist, data).subscribe((results: any) => {
  //   	if (results.status === 1) {
  //       this.loadCard_Details(results.allTaskers || 0,results.verifiedTaskers || 0,results.unVerifiedTaskers || 0,results.documentPendingTaskers || 0,results.todayTaskers || 0);			
  //   		this.source.load(results.response);
  //   		this.cd.detectChanges();
  //   	} else {
  //   		return;
  //   	}
  //   });
  // }
  onheaderCardChange(event) {
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
    } else if (event == 'pending') {
      data.status = 3;
      this.global_status = 3;
    } else if (event == 'today') {
      data.status = 5;
      this.global_status = 5;
    } else if (event == 'delete') {
      data.status = 6;
      this.global_status = 6;
    }
    this.loadsettings(event);
    this.Apiservice.CommonApi('post', Apiconfig.expertslist, data).subscribe((results: any) => {
      if (results.status === 1) {
        this.loadCard_Details(results.allTaskers || 0, results.verifiedTaskers || 0, results.unVerifiedTaskers || 0, results.documentPendingTaskers || 0, results.todayTaskers || 0, results.deletedTaskers || 0);
        this.source.load(results.response);
        this.count = results.count;
        this.cd.detectChanges();

      } else {
        return;
      }
    });
  }
  loadCard_Details(allTaskers, verifiedTaskers, unVerifiedTaskers, documentPendingTaskers, todayTaskers, deletedTaskers) {
    this.card_details = [
      {
        title: 'ALL Caregivers',
        value: allTaskers,
        bg_color: 'bg-success',
        icon: 'fa fa-bars',
        click_val: 'all',
      },
      {
        title: 'VERIFIED Caregivers',
        value: verifiedTaskers,
        bg_color: 'bg-info',
        icon: 'fa fa-check-square-o',
        click_val: 'active'
      },
      {
        title: 'UNVERIFIED Caregivers',
        value: unVerifiedTaskers,
        bg_color: 'bg-warning',
        icon: 'fa fa-times',
        click_val: 'inactive'
      },
      {
        title: "TODAY'S Caregivers",
        value: todayTaskers,
        bg_color: 'bg-secondary',
        icon: 'fa fa-users',
        click_val: 'today'
      },
      {
        title: 'DELETED Caregivers',
        value: deletedTaskers,
        bg_color: 'bg-danger',
        icon: 'fa fa-trash-o',
        click_val: 'delete'
      },
      {
        title: 'DOCUMENT VERIFICATION PENDING Caregivers',
        value: documentPendingTaskers,
        bg_color: 'bg-dark',
        icon: 'fa fa-trash-o',
        click_val: 'pending'
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
						title: 'Username',
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
						type: 'number',
						valuePrepareFunction: value => {
              if (this.curentUser && this.curentUser.user_details && this.curentUser.user_details.role == "subadmin") {
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
								return new DatePipe('en-US').transform(date, 'dd-MMM-yyyy, hh-mm a');
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
				// actions: {
				// 	add: true,
				// 	edit: false,
				// 	delete: false,
				// 	columnTitle: 'Actions',
				// 	class: 'action-column',
				// 	position: 'right',
				// 	custom: [
				// 		{
				// 			name: 'editaction',
				// 			type: 'html',
				// 			value: 'Edit',
				// 			title: '<div class="action-btn badge badge-pill badge-secondary mb-1"><i class="glyph-icon simple-icon-note"></i></div>',
				// 		},
				// 		{
				// 			name: 'restoreaction',
				// 			value: 'Restore',
				// 			title: '<div class="action-btn badge badge-pill badge-success mb-1"><i class="glyph-icon simple-icon-eye"></i></div>',
				// 			type: 'html',
				// 		},
				// 		{
				// 			name: 'forcedeleteaction',
				// 			value: 'Permanent Delete',
				// 			title: '<div class="action-btn badge badge-pill badge-danger mb-1"><i class="glyph-icon simple-icon-trash"></i></div>',
				// 			type: 'html',
				// 		},

				// 	],
        // },
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
        if (this.router.url == '/app/experts/taskers/taskerlist') {
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
    }else{
      this.settings = {
        selectMode: 'multi',
        hideSubHeader: true,
        columns: {
          username: {
            title: 'Name',
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
          status: {
            title: 'Status',
            filter: true,
            type: 'html',
            valuePrepareFunction: (value) => {
              if(value == 1){
                return "<span class='badge badge-pill badge-info mb-1'>Active</span>";
              }
              else if(value == 0){
                return "<span class='badge badge-pill badge-danger mb-1'>Deleted</span>";
              }
              else if(value != 6 || value != 1){
                return "<span class='badge badge-pill badge-warning mb-1'>Inactive</span>";
              }
            }
          },
          phone: {
            title: 'Phone',
            filter: true,
            type: 'number',
						valuePrepareFunction: value => {
              if (this.curentUser && this.curentUser.user_details && this.curentUser.user_details.role == "subadmin") {
                return 'XXXXX-XXXXX';
              } else {
                return value.number;
              }
						}
          },
          updatedAt: {
            title: 'Last Login',
            filter: true,
            valuePrepareFunction: date => {
              if (date) {
                return new DatePipe('en-US').transform(date, 'dd-MMM-yyyy, hh-mm a');
              } else {
                return null;
              }
            }
          },
          verificationstatus: {
            title: '',
            filter: false,
            type: "custom",
            renderComponent: VerifyiconComponent,
            sort: false,
            editable: true,
            onComponentInitFunction: (instance: any) => {
              instance.save.subscribe(row => {
                this.verifyunverify(row._id, row.status);
                //this.changedValue[row.content] = row.value;
              });
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
        if (this.router.url == '/app/experts/taskers/taskerlist') {
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
  }
  verifyunverify(id, status) {
    this.verifydatas.id = id;
    this.verifydatas.status = status;
    this.Apiservice.CommonApi('post', Apiconfig.taskerstatusupdate, this.verifydatas).subscribe(
      (data) => {
        if (data.status == 1) {
          this.notifications.create('Success', 'Status changed successfully', NotificationType.Success, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
          this.ngOnInit();
        } else {
          this.notifications.create('Error', data.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
        }
        (error) => {
          this.notifications.create('Error', error.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
        }
      })
  }

  onexportemit(event) {

    let data = {
      'skip': this.skip,
      'limit': this.limit,
      'format': event,
      'collection': 'users',
      'role': 'tasker'
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
        a.download = 'export';
        // start download
        a.click();
        this.notifications.create('Success', results.response, NotificationType.Success, { theClass: 'outline', timeOut: 3000, showProgressBar: false });
      } else {
        this.notifications.create('Error', results.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: false });
      }
    });

  }
}
