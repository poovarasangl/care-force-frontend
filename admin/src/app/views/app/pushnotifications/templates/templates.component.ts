import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { Apiconfig, AdminService } from "../../../../_services";
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit {
  settings: any;
  source: LocalDataSource = new LocalDataSource();
  skip: number = 0;
  limit: number = 10;
  editurl: string = 'app/pushnotifications/editnotification/';
  deleteurl = Apiconfig.Pushnotificationtemplatedelete;
  default_limit: number = 10;
  addbtn_name: string = 'pushnotifications.add-new';
  addurl = 'app/pushnotifications/addnotification';
  spinner = 'none';

  constructor(
    private Apiservice: AdminService,
    private notifications: NotificationsService
  ) { 
    this.settings = {
      selectMode: 'multi',
      hideSubHeader: true,
      columns: {
        name: {
          title: 'Name',
          filter: true
        },
        notificationtype: {
          title: 'Type',
          filter: true,
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
            {
              name: 'deleteaction',
              value: "Delete",
              title: '<div class="action-btn badge badge-pill badge-danger mb-1" title="Delete"><i class="glyph-icon simple-icon-trash"></i></div>',
              type: 'html',
            },
            // {
            //   name: 'viewaction',
            //   title: '<div class="action-btn badge badge-pill badge-info mb-1" title="View"><i class="glyph-icon simple-icon-eye"></i></div>',
            //   type: 'html',
            // }
          ]
        }
    }
  }

  ngOnInit() {
    this.showspinner();
    let data = {
			'skip': this.skip,
			'limit': this.limit
		}
		this.Apiservice.CommonApi('post', Apiconfig.Pushnotificationtemplatelist, data).subscribe((results: any) => {
			if (results.status === 1) {
        this.hidespinner();	
				this.source.load(results.response);
			} else {
        this.hidespinner();
				return;
			}
		});

  }

  onDeleteChange(event){
    this.ngOnInit();
  }

  onPageChange(event){

  }

  onSearchChange(event){
    this.showspinner();
    let data = {
			'skip': this.skip,
      'limit': this.limit,
      'search': event
		}
		this.Apiservice.CommonApi('post', Apiconfig.Pushnotificationtemplatelist, data).subscribe((results: any) => {
			if (results.status === 1) {	
        this.hidespinner();		
				this.source.load(results.response);
			} else {
        this.hidespinner();
				return;
			}
		});

  }

  onitemsPerPageChange(event){

  }

  showspinner() {
    this.spinner = 'block'
  }
  hidespinner() {
    this.spinner = 'none';
  }

}
