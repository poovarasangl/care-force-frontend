import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewProfileService } from './view-profile.service';
import { AlertService } from '../alert/alert.service';
import { StoreService } from '../store/store.service';
import { CONFIG } from '../config';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
import { SpinnerService } from '../spinner/spinner.service';
import * as Moment from 'moment'
import { extendMoment } from 'moment-range';
import { HomeService } from '../home/home.service';
const moment = extendMoment(Moment);

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.sass']
})
export class ViewProfileComponent implements OnInit {

  userprofile: any;
  Categorylist: any;
  imageurl = CONFIG.imageUrl;
  ratting:any;
  currentuser: any;
  cateogryid: any;
  jobdetails: any;
  settingsdata: any;
  selectdate: any;
  selectedtime: any;
  type = 'slug';
  completed_task : number =0;
  DefaultCurrency: any;

  constructor(private route: ActivatedRoute,
    private ApiService: ViewProfileService,
    private toastr: AlertService,
    private store: StoreService,
    private sweetalert: ConfirmDialogService,
    private spinner: SpinnerService,
    private router: Router,
    private homeService : HomeService ) {
    this.store.category.subscribe(result => {
      this.Categorylist = result;
    });
    this.store.landingdata.subscribe((result: any) => {
      this.settingsdata = result.settings;
    });
    this.currentuser = JSON.parse(localStorage.getItem('currentuser'));
    this.store.defaultcurrency.subscribe((result: any)=>{
      if(result && result.code){
        this.DefaultCurrency = result;
      }
    })
  }

  ngOnInit() {
    window.scrollTo(0,0);
    this.jobdetails = JSON.parse(localStorage.getItem('jobdetailsdata'));
    this.cateogryid = JSON.parse(localStorage.getItem('category_filter'));
    this.selectedtime = moment().format('HH:mm');
    this.selectdate = moment(new Date()).format('DD-MMMM-YYYY');
    const data = {
      username: this.route.snapshot.paramMap.get('username')
    }
    this.ApiService.viewprofile(data).subscribe(result => {
      if (result.status == 1) {
        this.userprofile = result.response.users;
        this.ratting = result.response.review;  
        this.completed_task = result.response.completed_task;
      } else {
        this.errorsmsg(result.response);
        this.router.navigate(['']);
      }
    });
  }
  counter(i: number) {
    return new Array(i);
  }
  homepage(){
    if(localStorage.getItem('selectedcategory')){
      let slugname = JSON.parse(localStorage.getItem('selectedcategory'));
      if(slugname.expiresAt + 86400000 > new Date().getTime()){      
      this.type = slugname.subcategory;
      if(localStorage.getItem('seletedtabtask') === 'veiw-experts'){
        this.jobdetails = false;
        this.router.navigate(['/task/view-experts', this.type]);
      }else{
        this.router.navigate(['/task/job-details', this.type]);
      }
    }else{
      localStorage.removeItem('selectedcategory');
      this.router.navigate(['']);
    }
    }else{
      localStorage.removeItem('selectedcategory');
      this.router.navigate(['']);
    }
  }
  getcategoryname(categiryid) {
    if (this.Categorylist.length) {
      let value = this.Categorylist.filter(x => x._id == categiryid);
      return value[0].name;
    }
  }
  ChooseExpert(item) { 
    this.sweetalert.confirm("Are you sure to confirm this?", () => {
      this.confrimexpert(item);
    }, () => {
      this.sweetalert.updatemessage(); 
    });
  }
  confrimexpert(item) {
    console.log(item);
    
    // debugger
    // this.showspinner();
    let data = {} as any;
    data = {
      hour_rate: item.hour_rate,
      tasker: {
        tasker_id: this.userprofile._id,
        username: this.userprofile.username,
        avatar: this.userprofile.avatar ? this.userprofile.avatar : null,
        phone: this.userprofile.phone,
        email: this.userprofile.email,
        status: this.userprofile.status,
        location: this.userprofile.location
      },
      taskers: [{
        tasker_id: item._id,
        username: item.username,
        status: 1
      }],
      category: {
        _id: item.childid._id,
        name: item.childid.name,
        commision: item.childid.commision,
        hour_time: item.childid.hours,
        parent_id: item.childid.parent,
        slug: item.childid.slug,
        ratetype: item.childid.ratetype,
      },
      address: this.jobdetails[0].task_address,
      location: this.jobdetails[0].location,
      description: this.jobdetails[0].task_description,
      task_date: this.selectdate,
      task_time: this.selectedtime,
      resttime: this.settingsdata.resttime,
      time_zone: this.settingsdata.time_zone,
      date_format: this.settingsdata.date_format,
      time_format: this.settingsdata.time_format,
      timestamp: new Date().toISOString(),
      bookingIdPrefix: this.settingsdata.bookingIdPrefix
    }
    // this.store.landingdata.subscribe((resp : any)=>{
    //   if(resp && resp.categories){
    //     let category = resp.categories.filter(x=>x._id == item.categoryid)[0];
    //     console.log(category.slug);
    //     this.homeService.Getsubcategory({slug : category.slug}).subscribe(result => {
    //       if (result.status === 1) {
    //         console.log(result.status);
    //       }
    //     });
    //   }
    // })
    
    if (this.currentuser) {
      data.user = {
        username: this.currentuser.user,
        user_id: this.currentuser.user_id,
        email: this.currentuser.email,
        phone: { code: this.currentuser.code, number: this.currentuser.phone },
        avatar: this.currentuser.avatar ? this.currentuser.avatar : null,
        status: this.currentuser.status
      }
      this.ApiService.addnewtask(data).subscribe((result: any) => {
        if (result.status === 0) {
          this.hidespinner();
          this.errorsmsg(result.response);
        } else {
          this.successmsg(result.response);
         setTimeout(() => {
          this.hidespinner();
          localStorage.setItem('showtab', 'Detailstab');
          this.router.navigate(['/account/job-details']);
         }, 1000);
         
        }
      });
    } else {
      this.hidespinner();
      localStorage.setItem('Taskassign', JSON.stringify(data));
      this.router.navigate(['/login']);
    }
  }
  successmsg(msg) {
    setTimeout(() => {
      this.toastr.clear();
    },2000);
    this.toastr.success(msg);
  }
  errorsmsg(msg) {
    setTimeout(() => {
      this.toastr.clear();
    },2000);
    this.toastr.error(msg);
  }
  warningmsg(msg) {
    setTimeout(() => {
      this.toastr.clear();
    },2000);
    this.toastr.warn(msg);
  }
  showspinner() {
    this.spinner.Spinner('show');
  }
  hidespinner() {
    this.spinner.Spinner('hide');
  }
}
