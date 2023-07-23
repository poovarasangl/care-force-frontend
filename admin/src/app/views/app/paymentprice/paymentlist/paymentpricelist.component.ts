import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'src/app/Common-Table/public-api';
import { AdminService, Apiconfig } from "../../../../_services";
import { NotificationType, NotificationsService } from 'angular2-notifications';
import { environment } from "src/environments/environment";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-paymentpricelist',
  templateUrl: './paymentpricelist.component.html',
  styleUrls: ['./paymentpricelist.component.scss']
})
export class PaymentpricelistComponent implements OnInit {

  settings: any;
	editurl: string = '/app/paymentsprice/edit';
  deleteurl = Apiconfig.paymentPriceDelete;
  source: LocalDataSource = new LocalDataSource();
  skip: number = 0;
  count : number = 0;
  limit: number = 10;
  addurl = 'app/paymentsprice/add';
  default_limit: number = 10;
  addbtn_name: string = 'paymentPrice.add-new';
  listCount : number;
  spinner = 'none';

  constructor( private apiService : AdminService, private notifications : NotificationsService,
    private cd: ChangeDetectorRef,
		private _domSanitizer: DomSanitizer  ) { 
this.loadsettings();    
  }

  ngOnInit(): void {
    this.showspinner();
    let data = {
      'skip': this.skip,
      'limit': this.limit
    }
    this.apiService.CommonApi('post', Apiconfig.paymentPriceList, data).subscribe((result:any) => {
      if(result.status == 1){
        this.hidespinner();
        this.listCount = result.response.length;
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

  // addPayPrice(){
  //   if(this.listCount < 4){
  //     return 'app/paymentprice/paymentpriceadd';
  //   }else{
  //     this.notifications.create('Error', "Payment Price can't be exceed than three", NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
  //   }
  // }

  onDeleteChange(event){
    this.ngOnInit();
    this.notifications.create('Success', 'Payment Price Deleted Successfully', NotificationType.Success, { theClass: 'outline primary', timeOut: 3000, showProgressBar: true });
  }

  onSearchChange(event){
    this.showspinner();
    this.apiService.CommonApi('post', Apiconfig.paymentPriceList, {'search':event, 'skip': 0, 'limit': 25 }).subscribe(result => {
      if(result.status == 1){
        this.hidespinner();
        this.source.load(result.response);
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
    this.apiService.CommonApi('post', Apiconfig.paymentPriceList, data).subscribe((results: any) => {
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
    this.apiService.CommonApi('post', Apiconfig.paymentPriceList, data).subscribe((result: any) => {
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
      image: {
        title: 'Image',
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
