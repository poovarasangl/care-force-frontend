import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../alert/alert.service';
import { StoreService } from '../../store/store.service';
import { CONFIG } from '../../config';
import * as Moment from 'moment'
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
import { ConfirmDialogService } from '../../confirm-dialog/confirm-dialog.service';
import { SpinnerService } from '../../spinner/spinner.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-view-experts',
  templateUrl: './view-experts.component.html',
  styleUrls: ['./view-experts.component.sass']
})
export class ViewExpertsComponent implements OnInit {
  cateogryid: any;
  jobdetails: any;
  taskerlist: any;
  maplist: any;
  imageUrl = CONFIG.imageUrl;
  datedropdown: any;
  minValue: number = 50;
  maxValue: number = 100;
  options = {
    floor: 50,
    ceil: 100
  } as any;
  dateValues: any;
  timeValues: any;
  showby_div = 0;
  zoom: number = 9;
  // initial center position for the map
  lat: number;
  lng: number;
  timeValuesarry: any;
  taskerlistfilter: any;
  selectdate: any;
  selectedtime: any;
  currentuser: any;
  count: number = 0;
  skip = 0;
  limit = 3;
  currentpage = 1;
  activePage = 1;
  settingsdata: any;
  routerurl: any;
  activepagenumber: number = 1;

  @ViewChild('priceValue') priceValue: ElementRef;
  DefaultCurrency: any;
  constructor(
    private ApiService: TaskService,
    private route: ActivatedRoute,
    private toastr: AlertService,
    private store: StoreService,
    private router: Router,
    private sweetalert: ConfirmDialogService,
    private cd: ChangeDetectorRef,
    private elementRef: ElementRef,
    private spinner: SpinnerService) {

    this.currentuser = JSON.parse(localStorage.getItem('currenttasker'));
    this.store.landingdata.subscribe((result: any) => {
      this.settingsdata = result.settings;
    });
    localStorage.setItem('Taskassign', JSON.stringify({ data: 1 }));
    this.routerurl = this.router.url;
    this.store.Url.next(this.routerurl);
    this.store.defaultcurrency.subscribe((result: any)=>{
      if(result && result.code){
       this.DefaultCurrency =  result;
      }
    })
  }

  ngOnInit() {
    var dateStart = moment(new Date()).format('DD-MMMM-YYYY');
    var dateEnd = moment(new Date()).add(30, 'days').format('DD-MMMM-YYYY');
    this.dateValues = Array.from(moment.range(moment(dateStart), moment(dateEnd)).by('day'));

    var now = moment();
    var currenttime = moment(now);
    var starttime = moment().startOf('day');
    const times = 24 * 2;
    let timelist = [];
    for (let i = 0; i < times; i++) {
      timelist.push(moment(starttime).add(30 * i, 'minutes'));
    }
    this.timeValuesarry = timelist;
    this.timeValues = timelist.map(function (s) { return moment(s) }).filter(function (m) { return m.isSameOrAfter(currenttime) });

    this.jobdetails = JSON.parse(localStorage.getItem('jobdetailsdata'));
    this.cateogryid = JSON.parse(localStorage.getItem('category_filter'));
    this.options = {
      floor: this.cateogryid.filtersInit.pricemin,
      ceil: this.cateogryid.filtersInit.pricemax
    }
    this.minValue = this.cateogryid.filtersInit.pricemin;
    this.maxValue = this.cateogryid.filtersInit.pricemax;
    if (this.cateogryid && this.jobdetails) {
      this.lat = this.jobdetails[0].location.lat;
      this.lng = this.jobdetails[0].location.long;
      let data = {
        lat: this.jobdetails[0].location.lat,
        lon: this.jobdetails[0].location.long,
        categoryid: this.cateogryid.category._id,
        category_hours: this.cateogryid.category.SubCategoryInfo.hours,
        timeout: false,
        date: moment(new Date()).format('DD-MMMM-YYYY'),
        time: moment(this.timeValues[0]).format('HH:mm'),
        price: [this.cateogryid.filtersInit.pricemin, this.cateogryid.filtersInit.pricemax],
        sort: 1,
        view: this.showby_div == 0 ? 'list' : 'view',
        skip: this.skip,
        limit: this.limit
      }
      this.get_tasker_list(data);
    }
  }
  get_tasker_list(data) {
    this.selectedtime = moment(this.timeValues[0]).format('HH:mm');
    this.selectdate = moment(new Date()).format('DD-MMMM-YYYY');
    
    this.ApiService.Taskeravailability(data).subscribe(result => {
      if (result.status == 1) {
        if (result.count >= 1) {
          let allTask = result.tasklist;
          let allTaskers = result.response.taskers;
          for (let i = 0; i < allTask.length; i++) {
            for (let j = 0; j < allTaskers.length; j++) {
              if (allTask[i].tasker.tasker_id == allTaskers[j]._id) {
                if (allTask[i].task_details && allTask[i].task_details.task_time == this.selectedtime && (allTask[i].status == 2 || allTask[i].status == 3 || allTask[i].status == 4 || allTask[i].status == 5)) {
                  allTaskers.splice(j, 1)
                }
              }
            }
          }
          this.taskerlist = allTaskers;
          this.maplist = result.response.taskers;
          this.count = result.count;
          this.taskerlistfilter = result.response.taskers;          
          if (data.view == 'list') {
            this.taskerlist = this.showbyPrice(this.priceValue.nativeElement.value);
          }
          this.cd.detectChanges();
        }
      } else {
        //this.errorsmsg(result.response);
      }
    })
  }

  showby(event) {
    if (event.target.value === 'map') {
      this.showby_div = 1;
      let data = {
        lat: this.jobdetails[0].location.lat,
        lon: this.jobdetails[0].location.long,
        categoryid: this.cateogryid.category._id,
        category_hours: this.cateogryid.category.SubCategoryInfo.hours,
        timeout: false,
        date: moment(new Date()).format('DD-MMMM-YYYY'),
        time: moment(this.timeValues[0]).format('HH:mm'),
        price: [this.cateogryid.filtersInit.pricemin, this.cateogryid.filtersInit.pricemax],
        sort: 1,
        view: this.showby_div == 0 ? 'list' : 'view',
        // skip: this.skip,
        // limit: this.limit
      }
      this.get_tasker_list(data);

    } else if (event.target.value === 'list') {
      this.showby_div = 0;
      let data = {
        lat: this.jobdetails[0].location.lat,
        lon: this.jobdetails[0].location.long,
        categoryid: this.cateogryid.category._id,
        category_hours: this.cateogryid.category.SubCategoryInfo.hours,
        timeout: false,
        date: moment(new Date()).format('DD-MMMM-YYYY'),
        time: moment(this.timeValues[0]).format('HH:mm'),
        price: [this.cateogryid.filtersInit.pricemin, this.cateogryid.filtersInit.pricemax],
        sort: 1,
        view: this.showby_div == 0 ? 'list' : 'view',
        skip: this.skip,
        limit: this.limit
      }
      this.get_tasker_list(data);
    }
  }
  showbyPrice(data) {
    if (data == 1) {
      let newList = this.taskerlist.sort(function (a, b) {
        a.taskerskills.hour_rate - b.taskerskills.hour_rate;
      });
      return newList;
    } else {
      let newList = this.taskerlist.sort(function (a, b) {
        b.taskerskills.hour_rate - a.taskerskills.hour_rate;
      });
      return newList;
    }
  }
  pricechange(event) {
    if (event.target.value == 1) {
      this.taskerlist.sort(function (a, b) {
        return a.taskerskills.hour_rate - b.taskerskills.hour_rate;
      });
    } else {
      this.taskerlist.sort(function (a, b) {
        return b.taskerskills.hour_rate - a.taskerskills.hour_rate;
      });
    }
  }
  getpricelimit(value) {
    this.taskerlist = this.taskerlistfilter.filter(x => x.taskerskills.hour_rate >= this.minValue && x.taskerskills.hour_rate <= this.maxValue);
    this.count = this.taskerlist.length;
    if(this.taskerlist.length > 0 && this.count > 2){
      this.elementRef.nativeElement.querySelector('#clear-btn-pagination').click();
    }
  }
  getimage(avatar,index) {    
    return avatar ? this.imageUrl + avatar : 'assets/images/Default/user.jpg';
  }
  datechange(event) {
    this.selectdate = event.target.value;
    var now = moment();
    var currenttime = moment(now);
    if (Date.parse(event.target.value) > Date.parse(moment(new Date()).format('DD-MMMM-YYYY'))) {
      this.timeValues = this.timeValuesarry
    } else {
      this.timeValues = this.timeValuesarry.map(function (s) { return moment(s) }).filter(function (m) { return m.isSameOrAfter(currenttime) });
    }
    let data = {
      lat: this.jobdetails[0].location.lat,
      lon: this.jobdetails[0].location.long,
      categoryid: this.cateogryid.category._id,
      category_hours: this.cateogryid.category.SubCategoryInfo.hours,
      timeout: false,
      date: moment(this.selectdate).format('DD-MMMM-YYYY') ? moment(this.selectdate).format('DD-MMMM-YYYY') : moment(new Date()).format('DD-MMMM-YYYY'),
      time: moment(this.timeValues[0]).format('HH:mm'),
      price: [this.cateogryid.filtersInit.pricemin, this.cateogryid.filtersInit.pricemax],
      sort: 1,
      view: this.showby_div == 0 ? 'list' : 'view',
      skip: this.skip,
      limit: this.limit
    }
    this.ApiService.Taskeravailability(data).subscribe(result => {
      if (result.status == 1) {
        if (result.count >= 1) {
          this.taskerlist = result.response.taskers;
          this.maplist = result.response.taskers;          
          this.count = result.count;
          this.taskerlistfilter = result.response.taskers;
          if(this.taskerlist.length > 0 && this.count > 2){
            this.elementRef.nativeElement.querySelector('#clear-btn-pagination').click();
          }
        } else {
          this.taskerlist = [];
          this.maplist = [];
          this.count = 0;
          this.taskerlistfilter = [];
        }
      } else {
        this.taskerlist = [];
        this.maplist = [];
        this.count = 0;
        this.taskerlistfilter = [];
        this.errorsmsg(result.response);
      }
    })
  }
  timechange(event) {
    this.selectedtime = event.target.value;
    let data = {
      lat: this.jobdetails[0].location.lat,
      lon: this.jobdetails[0].location.long,
      categoryid: this.cateogryid.category._id,
      category_hours: this.cateogryid.category.SubCategoryInfo.hours,
      timeout: false,
      date: moment(this.selectdate).format('DD-MMMM-YYYY') ? moment(this.selectdate).format('DD-MMMM-YYYY') : moment(new Date()).format('DD-MMMM-YYYY'),
      time: this.selectedtime,
      price: [this.cateogryid.filtersInit.pricemin, this.cateogryid.filtersInit.pricemax],
      sort: 1,
      view: this.showby_div == 0 ? 'list' : 'view',
      skip: this.skip,
      limit: this.limit
    }
    this.ApiService.Taskeravailability(data).subscribe(result => {
      if (result.status == 1) {
        if (result.count >= 1) {
          this.taskerlist = result.response.taskers;
          this.maplist = result.response.taskers;
          this.taskerlistfilter = result.response.taskers;
          if(this.taskerlist.length > 0 && this.count > 2){
            this.elementRef.nativeElement.querySelector('#clear-btn-pagination').click();
          }
        }
      } else {
        this.errorsmsg(result.response);
      }
    })
  }
  counter(i: number) {
    return new Array(i);
  }
  pagechange(event) {
    if (this.currentpage != event) {
      this.activepagenumber = event;
      this.currentpage = event;
      let data = {
        lat: this.jobdetails[0].location.lat,
        lon: this.jobdetails[0].location.long,
        categoryid: this.cateogryid.category._id,
        category_hours: this.cateogryid.category.SubCategoryInfo.hours,
        timeout: false,
        date: moment(this.selectdate).format('DD-MMMM-YYYY') ? moment(this.selectdate).format('DD-MMMM-YYYY') : moment(new Date()).format('DD-MMMM-YYYY'),
        time: this.selectedtime,
        price: [this.cateogryid.filtersInit.pricemin, this.cateogryid.filtersInit.pricemax],
        sort: 1,
        view: this.showby_div == 0 ? 'list' : 'view',
        skip: this.limit * (this.currentpage - 1),
        limit: this.limit * this.currentpage
      }
      this.ApiService.Taskeravailability(data).subscribe(result => {
        if (result.status == 1) {
          if (result.count >= 1) {
            this.taskerlist = result.response.taskers;
            this.maplist = result.response.taskers;
            this.taskerlistfilter = result.response.taskers;
            // if(this.taskerlist.length > 0 && this.count > 2){
            //   this.elementRef.nativeElement.querySelector('#clear-btn-pagination').click();
            // }
          }
        } else {
          this.errorsmsg(result.response);
        }
      })
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
    this.showspinner();
    let data = {} as any;
    data = {
      hour_rate: item.taskerskills.hour_rate,
      tasker: {
        tasker_id: item._id,
        username: item.username,
        avatar: item.avatar ? item.avatar : '',
        phone: item.phone,
        email: item.email,
        status: item.status,
        location: item.location
      },
      taskers: [{
        tasker_id: item._id,
        username: item.username,
        status: 1
      }],
      category: {
        _id: this.cateogryid.category._id,
        name: this.cateogryid.category.SubCategoryInfo.name,
        commision: this.cateogryid.category.SubCategoryInfo.commision,
        admincommision : this.cateogryid.category.SubCategoryInfo.admincommision,
        hour_time: this.cateogryid.category.SubCategoryInfo.hours,
        parent_id: this.cateogryid.category.SubCategoryInfo.parent,
        slug: this.cateogryid.category.SubCategoryInfo.slug,
        ratetype: this.cateogryid.category.SubCategoryInfo.ratetype,
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
    if (this.currentuser) {
      data.user = {
        username: this.currentuser.user,
        user_id: this.currentuser.user_id,
        email: this.currentuser.email,
        phone: { code: this.currentuser.code, number: this.currentuser.phone },
        avatar: this.currentuser.avatar ? this.currentuser.avatar : '',
        status: this.currentuser.status
      }
      this.ApiService.addnewtask(data).subscribe((result: any) => {
        if (result.status === 0) {
          this.hidespinner();
          this.errorsmsg(result.response);
        } else {
          this.successmsg(result.response);
          this.store.notificationemit.next('newnotification');
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
  viewprofilefun(username) {
    this.router.navigate(['/view-profile', username]);
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
