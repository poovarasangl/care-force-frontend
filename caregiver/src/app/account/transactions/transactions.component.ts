import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../account.service';
import { AlertService } from '../../alert/alert.service';
import { StoreService } from '../../store/store.service';
import { SpinnerService } from '../../spinner/spinner.service';
import { ModalService } from '../../modal/modal.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.sass']
})
export class TransactionsComponent implements OnInit {
  profiledata: any;
  limit: number = 5;
  skip: number = 0;
  transactionlist: any;
  count: number = 0;
  openreview:any;
  category:any;
  settings:any;
  currentuser: any = {};
  currentpage: number = 1;
  DefaultCurrency:any;
  
  constructor(
    private ApiService: AccountService,
    private toastr: AlertService, 
    private store : StoreService,
    private spinner: SpinnerService,
    private modalservice : ModalService) {}

  ngOnInit() {
    this.hidespinner();
    localStorage.setItem('showtab', 'Transactionstab');
    this.ApiService.Profiledetails.subscribe(result => {
      this.profiledata = result;
      if (this.profiledata && this.profiledata.role) {
        let data = {
          limit: this.limit,
          skip: this.skip,
          role: this.profiledata.role,
          id: this.profiledata._id
        }
        this.ApiService.gettransaction(data).subscribe(list => {
          if (list.status === 1) {
            this.transactionlist = list.response.list;
            this.count = list.response.count;            
          }
        });
      }
    });
    this.store.landingdata.subscribe((result: any) => {
      if (result) {
        this.settings = result.settings;
        this.DefaultCurrency = result.currencies.filter(x => x.default === 1)[0];
      }
    });
  }
  pagechange(event) {
    if(this.currentpage != event){
    this.currentpage = event;
    let data = {
      skip: this.limit * (this.currentpage - 1),
      limit: this.limit * this.currentpage,
      role: this.profiledata.role,
      id: this.profiledata._id
    }
    this.ApiService.gettransaction(data).subscribe(list => {
      if (list.status === 1) {
        this.transactionlist = list.response.list;
        this.count = list.response.count;
      }
    });
  }
  }
  view(item) {
    this.store.category.subscribe((result:any)=>{
      this.openreview = item;
      this.openreview.maincategory = result.filter(x=>x._id === item.category.parent_id)[0].name;
      this.modalservice.show('Transaction',this.openreview,'transaction');
    });   
    // this.transaction.show();
  }
  successmsg(msg) {
    setTimeout(() => {
      this.toastr.clear();
    }, 2000);
    this.toastr.success(msg);
  }
  errorsmsg(msg) {
    setTimeout(() => {
      this.toastr.clear();
    }, 2000);
    this.toastr.error(msg);
  }
  warningmsg(msg) {
    setTimeout(() => {
      this.toastr.clear();
    }, 2000);
    this.toastr.warn(msg);
  }
  showspinner() {
    this.spinner.Spinner('show');
  }
  hidespinner() {
    this.spinner.Spinner('hide');
  }
}
