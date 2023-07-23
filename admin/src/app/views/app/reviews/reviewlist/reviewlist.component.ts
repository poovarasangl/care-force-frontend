import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { Apiconfig, AdminService } from "../../../../_services";
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { ConsoleService } from '@ng-select/ng-select/lib/console.service';

@Component({
  selector: 'app-reviewlist',
  templateUrl: './reviewlist.component.html',
  styleUrls: ['./reviewlist.component.scss']
})
export class ReviewlistComponent implements OnInit {
  settings: any;
	source: LocalDataSource = new LocalDataSource();
	skip: number = 0;
	limit: number = 10;
	count : number = 0;
	spinner = 'none';
	default_limit : number = 10;
	addurl: string = '/app/reviews/add';
	editurl: string = '/app/reviews/edit';
	deleteurl: string = Apiconfig.reviewdelete;
  card_details : any[];
  
  constructor(
    private Apiservice: AdminService,
		private notifications: NotificationsService,
		private cd: ChangeDetectorRef,

  ) {
this.loadsettings();
   }

  ngOnInit() {
	  this.showspinner();
    let data = {
      'type': 'all',
			'skip': this.skip,
			'limit': this.limit
		}
		this.Apiservice.CommonApi('post', Apiconfig.reviewlist, data).subscribe((results: any) => {
      
			if (results.status === 1) {	
				this.hidespinner();
				this.loadCard_Details(results.allValue || 0,results.userValue || 0,results.taskerValue || 0);			
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
			'type': 'all',
			'skip': this.limit * (event - 1),
			'limit': this.limit * event
		}
		this.Apiservice.CommonApi('post', Apiconfig.reviewlist, data).subscribe((results: any) => {
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
			'search' : event
		}
		this.Apiservice.CommonApi('post', Apiconfig.reviewlist, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.hidespinner();
				this.loadCard_Details(results.allValue || 0,results.userValue || 0,results.taskerValue || 0);		
				this.source.load(results.response);
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
		this.settings
		let data = {
			'type': 'all',
		  'skip': this.skip,
		  'limit': this.limit
		}
		this.Apiservice.CommonApi('post', Apiconfig.reviewlist, data).subscribe((results: any) => {
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
	onheaderCardChange(event){
		this.showspinner();
		this.source = new LocalDataSource();
		let data = {
			'skip': this.skip,
			'limit': this.limit,
			'type' : "all"
		}
		if(event == 'all'){
			data.type = "all";
		}else if(event == 'user'){
			data.type = 'user';
		}else if(event == 'tasker'){
			data.type = 'tasker';
		}
		this.Apiservice.CommonApi('post', Apiconfig.reviewlist, data).subscribe((results: any) => {
			if (results.status === 1) {
				this.hidespinner();
				this.loadCard_Details(results.allValue || 0,results.userValue || 0,results.taskerValue || 0);
				this.source.load(results.response);
			} else {
				this.hidespinner();
				return;
			}
		});
	}

	loadCard_Details(allreviews,reviewUsers,reviewTaskers){
		this.card_details = [
			{
			  title : 'ALL REVIEWS',
			  value : allreviews,
			  bg_color : 'bg-success',
			  icon : 'fa fa-star',
			  click_val : 'all'
			},
			{
			  title : 'REVIEW BY USERS',
			  value : reviewUsers,
			  bg_color : 'bg-danger',
			  icon : 'fa fa-users',
			  click_val : 'user'
			},
			{
				title: 'REVIEW BY TASKERS',
			  value : reviewTaskers,
			  bg_color : 'bg-primary',
			  icon : 'fa fa-users',
			  click_val : 'tasker'
			}
		  ];
	}
loadsettings(){
	this.settings = {
		selectMode: 'multi',
		hideSubHeader: true,
		columns: {
			rating: {
				title: 'Rating',
	  filter: true,
	  type: 'html',
				valuePrepareFunction: value => {
		  if(value == 5){
			return  '<span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span>';
		  }else if(value == 4){
			return  '<span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span>';
		  }else if(value == 3){
			return  '<span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span>';
		  }else if(value == 2){
			return  '<span class="fa fa-star checked"></span><span class="fa fa-star checked"></span>';
		  }else if(value == 1){
			return  '<span class="fa fa-star checked"></span>';
		  }
				}
			},
			usertasker: {
				title: 'Reviewed By',
				filter: true
			},
			type: {
				title: 'Type',
				filter: true
	},
	booking_id: {
				title: 'Task ID',
				filter: true
	},
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
				// {
				// 	name: 'viewaction',
				// 	title: '<div class="action-btn badge badge-pill badge-info mb-1" title="Wallet"><i class="glyph-icon simple-icon-wallet"></i></div>',
				// 	type: 'html',
				// }
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
