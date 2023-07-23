import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { AdminService, Apiconfig } from "../../../../_services";
import { NotificationType, NotificationsService } from 'angular2-notifications';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  settings: any;
  editurl: string = '/app/email-template/edit';
  deleteurl = Apiconfig.deleteTemplate;
  source: LocalDataSource = new LocalDataSource();
  skip: number = 0;
  limit: number = 10;
  count : number = 0;
  default_limit: number = 10;
  addbtn_name: string = 'emailtemplate.add-new';
  addurl = '/app/email-template/add';
  spinner = 'none';

  constructor(    private apiService : AdminService, private notifications : NotificationsService, 
    private cd: ChangeDetectorRef,

    ) { 
      this.loadsettings();
    }

  ngOnInit(): void {
    this.showspinner();
    let data = {
      'skip': this.skip,
      'limit': this.limit
    }
    this.apiService.CommonApi('post', Apiconfig.templateList, data).subscribe(result => {
      this.hidespinner();
      if(result.status == 1){
        this.source.load(result.response);
        this.count = result.count;
        this.cd.detectChanges();
      }else{
        this.source.load([]);
      }(err) => {
        this.hidespinner();
        console.log(err);
      }
    });
  }

  
  onDeleteChange(event){
    this.ngOnInit();
    this.notifications.create('Success', 'Email Template Deleted Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: true });
  }

  onPageChange(event){
    this.showspinner();
    this.source = new LocalDataSource();
    let data = {
      'skip': this.limit * (event - 1),
      'limit': this.limit * event
    }
    this.apiService.CommonApi('post', Apiconfig.templateList, data).subscribe((results: any) => {
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

  onSearchChange(event){
    this.showspinner();
    this.apiService.CommonApi('post', Apiconfig.templateList, {'search':event, 'skip': 0, 'limit': 25 }).subscribe(result => {
      if(result.status == 1){
        this.hidespinner();
        this.source.load(result.response);
        this.count = result.count;
      }else{
        this.source.load([]);
      }(err) => {
        this.hidespinner();
        console.log(err);
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
    this.apiService.CommonApi('post', Apiconfig.templateList, data).subscribe((results: any) => {
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
        title: 'Template Name',
        filter: true
      },
      email_subject: {
        title: 'Email Subject',
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
showspinner() {
  this.spinner = 'block'
}
hidespinner() {
  this.spinner = 'none';
}
}
