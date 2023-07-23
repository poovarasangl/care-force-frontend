import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { AdminService, Apiconfig } from 'src/app/_services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-peoplecmdlist',
  templateUrl: './peoplecmdlist.component.html',
  styleUrls: ['./peoplecmdlist.component.scss']
})
export class PeoplecmdlistComponent implements OnInit {
  
  settings: any;
	editurl: string = '/app/peoplecomments/edit';
  deleteurl = Apiconfig.peopleCmdDelete;
  source: LocalDataSource = new LocalDataSource();
  skip: number = 0;
  limit: number = 10;
  count : number = 0;
  spinner = 'none';
  default_limit: number = 10;
  addbtn_name: string = 'peopleCmd.add-new';
  addurl = '/app/peoplecomments/add'

  constructor(  private apiService : AdminService, private notifications : NotificationsService,
    private cd: ChangeDetectorRef,
		private _domSanitizer: DomSanitizer ) { 
        this.loadsettings();
    }

  ngOnInit(): void {
    this.showspinner();
    let data = {
      'skip': this.skip,
      'limit': this.limit
    }
    this.apiService.CommonApi('post', Apiconfig.peopleCmdList, data).subscribe((result: any) => {
      if(result.status == 1){
        this.hidespinner();
        this.source.load(result.response);
        this.count = result.count;
        this.cd.detectChanges();
      }else{
        this.hidespinner();
        this.source.load([]);
      }(err) => {
        this.hidespinner();
        console.log(err);
      }
    });
  }

  onDeleteChange(event){
    this.ngOnInit();
    this.notifications.create('Success', 'People Comment Deleted', NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: true });
  }

  onSearchChange(event){
    this.showspinner();
    this.apiService.CommonApi('post', Apiconfig.peopleCmdList, {'search':event, 'skip': 0, 'limit': 25 }).subscribe(result => {
      if(result.status == 1){
        this.hidespinner();
        this.source.load(result.response);
        this.count = result.count;
      }else{
        this.hidespinner();
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
    this.apiService.CommonApi('post', Apiconfig.peopleCmdList, data).subscribe((results: any) => {
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
  onPageChange(event){
    this.showspinner();
    this.source = new LocalDataSource();
    let data = {
      'skip': this.limit * (event - 1),
      'limit': this.limit * event
    }
    this.apiService.CommonApi('post', Apiconfig.peopleCmdList, data).subscribe((result: any) => {
    	if (result.status === 1) {
        this.hidespinner();
        this.source.load(result.response);
        this.count = result.count;
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
          title: 'Name',
          filter: true
        },
        profession: {
          title: 'Profession',
          filter: true
        },
        image: {
          title: 'People Image',
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
