import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { AdminService, Apiconfig } from "src/app/_services";
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Component({
  selector: 'app-subadminlist',
  templateUrl: './subadminlist.component.html',
  styleUrls: ['./subadminlist.component.scss']
})
export class SubadminlistComponent implements OnInit {

  settings: any;
  skip: number = 0;
  limit: number = 10;
  default_limit: number = 10;
  count: number = 0;
  source: LocalDataSource = new LocalDataSource();
  editurl: string = '/app/administrator/subadminedit';
  viewurl: string = '/app/administrator/subadminedit';
  addurl: string = '/app/administrator/subadminadd';
  addbtn_name: string = 'Add Sub-Admin'
  deleteurl: string = Apiconfig.ContactDelete;
	spinner = 'none';
  constructor(
    private Apiservice: AdminService,
    private notifications: NotificationsService,
    private cd: ChangeDetectorRef,

  ) {this.loadsettings(); }

	ngOnInit(): void {
		this.source = new LocalDataSource();
		let data = {
			'skip': this.skip,
			'limit': this.limit
		}
		this.Apiservice.CommonApi('post', Apiconfig.subadminlist, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.source.load(results.response);
				this.count = results.count;
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
		this.source = new LocalDataSource();
		let data = {
			'skip': this.limit * (event - 1),
			'limit': this.limit * event
		}
		this.Apiservice.CommonApi('post', Apiconfig.subadminlist, data).subscribe((results: any) => {
			if (results.status === 1) {
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
		let data = {
			'skip': this.skip,
			'limit': this.limit,
			search: event
		};
		this.Apiservice.CommonApi('post', Apiconfig.subadminlist, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.source.load(results.response);
				this.count = results.count;
				this.cd.detectChanges();
			} else {
				return;
			}
		});
	}

	onitemsPerPageChange(event) {
		this.limit = event;
		this.default_limit = event;
		this.skip = 0;
		this.source = new LocalDataSource();
		this.settings
		let data = {
			'skip': this.skip,
			'limit': this.limit
		}
		this.Apiservice.CommonApi('post', Apiconfig.subadminlist, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.loadsettings();
				this.source.load(results.response);
				this.count = results.count;
				this.cd.detectChanges();
			} else {
				return;
			}
		});
  }
  
  loadsettings() {
		this.settings = {
			selectMode: 'multi',
			hideSubHeader: true,
			columns: {
				username: {
					title: 'Username',
					filter: true
				},
				email : {
					title: 'Email',
					filter: true,
        },
        updatedAt : {
					title: 'Last Login Date',
					filter: true,
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
				custom: [
					{
						name: 'editaction',
						type: 'html',
						value: "Edit",
						title: '<div class="action-btn badge badge-pill badge-secondary mb-1"><i class="glyph-icon simple-icon-note"></i></div>',
					},
					{
						name: 'deleteaction',
						value: "Delete",
						title: '<div class="action-btn badge badge-pill badge-danger mb-1" title="Delete"><i class="glyph-icon simple-icon-trash"></i></div>',
						type: 'html',
					},
				],
			},
		}
	}
}