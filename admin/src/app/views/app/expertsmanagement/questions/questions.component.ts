import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { Apiconfig, AdminService } from "../../../../_services";
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit {

  settings: any;
  skip: number = 0;
  limit: number = 10;
  default_limit: number = 10;
  count : number = 0;
	source: LocalDataSource = new LocalDataSource();
	editurl: string = '/app/expertsmanagement/question/edit';
	addurl: string = '/app/expertsmanagement/question/add';
	deleteurl: string = Apiconfig.questiondelete;
	addbtn_name: string = 'question.add-new';
	spinner = 'none';
  constructor(
    private Apiservice: AdminService,
    private router: Router,
	private notifications: NotificationsService,
	private cd: ChangeDetectorRef,

  ) { 
    this.loadsettings();
   }

  ngOnInit() {
	  this.showspinner();
    this.Apiservice.CommonApi('post', Apiconfig.questionlist, { 'skip': 0, 'limit': 25 }).subscribe((results: any) => {
      if (results) {
        if(results.status == 1){
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
    this.notifications.create('Success', event, NotificationType.Success, { theClass: 'outline', timeOut: 3000, showProgressBar: true });		
		this.ngOnInit();
	}

	onPageChange(event) {
		console.log(event);
	}
	onSearchChange(event) {
		this.showspinner();
		this.Apiservice.CommonApi('post', Apiconfig.questionlist, {'search': event, 'skip': 0, 'limit': 25 }).subscribe((results: any) => {
     
      if (results) {
        if(results.status == 1){
			this.hidespinner();
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
		this.limit = event;
		this.skip = 0;
		this.default_limit = event;
		this.source = new LocalDataSource();
		this.settings
		let data = {
		  'skip': this.skip,
		  'limit': this.limit
		}
		this.Apiservice.CommonApi('post', Apiconfig.questionlist, data).subscribe((results: any) => {
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
				question: {
					title: 'Question',
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
					}
				],
			},
		}
	}
	showspinner() {
		this.spinner = 'block'
	}
	hidespinner() {
		this.spinner = 'none';
	}
}
