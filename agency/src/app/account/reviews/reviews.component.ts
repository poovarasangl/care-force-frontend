import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { AlertService } from '../../alert/alert.service';
import { SpinnerService } from '../../spinner/spinner.service';
import { ModalService } from '../../modal/modal.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.sass']
})
export class ReviewsComponent implements OnInit {
  ReviewsToYou: boolean = true;
  ReviewsByYou: boolean = false;
  profiledata: any;
  limit: number = 2;
  skip: number = 0;
  reviewlist: any;
  count: number = 0;
  currentuser: any;
  activepagenumber: number = 1;
  currentpage: number = 1;
  reviewtoyoupage:boolean = false;

  constructor(
    private ApiService: AccountService, 
    private toastr: AlertService,
    private spinner: SpinnerService,
    private modalservice : ModalService) { }

  ngOnInit() {
    this.hidespinner();
    this.reviewtoyoupage = true;
    localStorage.setItem('showtab', 'Reviewstab');
    this.currentuser = JSON.parse(localStorage.getItem('currentuser'));
    this.ApiService.Profiledetails.subscribe(result => {    
      this.profiledata = result;
      if (this.profiledata && this.profiledata.role) {
        let data = {
          limit: this.limit,
          skip: this.skip,
          role: this.profiledata.role,
          id: this.profiledata._id
        }
        this.ApiService.getreviewtoyou(data).subscribe((list): any => {
          if (list.status === 1) {
            this.reviewlist = list.response;
            this.count = list.count;
          }
        });
      }
    });
  }

  reviewtoyou() {
    this.reviewtoyoupage = true;
    this.showspinner();
    this.reviewlist = '';
    let data = {
      limit: this.limit,
      skip: this.skip,
      role: this.profiledata.role,
      id: this.profiledata._id
    }
    this.ApiService.getreviewtoyou(data).subscribe(result => {
      this.hidespinner();
      if (result.status === 1) {
        this.reviewlist = result.response;
        this.count = result.count;
      }
    });
  }
  reviewyou() {
    this.reviewtoyoupage = false;
    this.showspinner();
    this.reviewlist = '';
    this.count = 0;
    let data = {
      limit: this.limit,
      skip: this.skip,
      role: this.profiledata.role,
      id: this.profiledata._id
    }
    this.ApiService.getreviewbyyou(data).subscribe(result => {
      this.hidespinner();
      if (result.status === 1) {
        this.reviewlist = result.response;
        this.count = result.count;
      }
    })
  }
  view(item){
    this.modalservice.show('Review Details',item,'review');
  }
  pagechange(event) {
    if (this.currentpage != event) {
      this.activepagenumber = event;
      this.currentpage = event;
      let data = {
        role: this.profiledata.role,
        id: this.profiledata._id,
        skip: this.limit * (this.currentpage - 1),
        limit: this.limit * this.currentpage,
      }
      if(this.reviewtoyoupage){
        this.reviewlist = '';
        this.count = 0;
        this.ApiService.getreviewbyyou(data).subscribe(result => {
          this.hidespinner();
          if (result.status === 1) {
            this.reviewlist = result.response;
            this.count = result.count;
          }
        })
      }else{
        this.reviewlist = '';
        this.count = 0;
        this.ApiService.getreviewbyyou(data).subscribe(result => {
          this.hidespinner();
          if (result.status === 1) {
            this.reviewlist = result.response;
            this.count = result.count;
          }
        })
      }
    }
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

