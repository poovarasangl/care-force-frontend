import { DatePipe } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { AdminService, Apiconfig } from "../../../../_services";

@Component({
  selector: 'app-mainadminlist',
  templateUrl: './mainadminlist.component.html',
  styleUrls: ['./mainadminlist.component.scss']
})
export class MainadminlistComponent implements OnInit {
  settings: any;
  skip: number = 0;
  limit: number = 10;
  default_limit: number = 10;
  count: number = 0;
  source: LocalDataSource = new LocalDataSource();
  editurl: string = '/app/administrator/mainadminedit';
  viewurl: string = '/app/administrator/mainadminedit';
  addurl: string = '/app/administrator/mainadminedit';
  addbtn_name: string = 'contact.add-new'
  deleteurl: string = Apiconfig.ContactDelete;

  spinner: string = 'none';

  constructor(
    private Apiservice: AdminService,
    private notifications: NotificationsService,
    private cd: ChangeDetectorRef,

  ) {
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
          filter: true
        },
        status: {
          title: 'Status',
          filter: false,
          type: 'html',
          valuePrepareFunction: value => {
            return value == 1 ? "<span class='badge badge-pill badge-info mb-1'>Active</span>" : "<span class='badge badge-pill badge-warning mb-1'>InActive</span>";
          }
        },
        updatedAt: {
          title: 'Last Login',
          filter: false,
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
    this.Apiservice.CommonApi('post', Apiconfig.UserList, data).subscribe(
      (data) => {
        this.hidespinner();
        if (data.status == 1) {
          this.source.load(data.response);
        } else {
          this.source.load([]);
        }
      }, (error) => {
        this.hidespinner();
        console.log(error);
      })
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
    this.Apiservice.CommonApi('post', Apiconfig.UserList, data).subscribe(
      (data) => {
        this.hidespinner();
        if (data.status == 1) {
          this.source.load(data.response);
        } else {
          this.source.load([]);
        }
      }, (error) => {
        this.hidespinner();
        console.log(error);
      })
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
        this.source.load(results.response);
        // this.cd.detectChanges();
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
