import { Component, OnInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { StoreService } from '../../store/store.service';
import { ProgressService } from '../progress.service';
import { isArray } from 'util';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AlertService } from '../../alert/alert.service';
import * as $ from 'jquery'
import { MapsAPILoader, MouseEvent } from '@agm/core';
import * as Moment from 'moment'
import { extendMoment } from 'moment-range';
import { CONFIG } from '../../config';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';

const moment = extendMoment(Moment);
@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.sass']
})
export class ProgressComponent implements OnInit {
  Category: any;
  Subcategory: any;
  postheader: any;
  peoplecmd: any;
  posttasks: any;
  categories: any;
  currentuser: any;
  appearance: any;
  maincategoryvalue: any;
  manicat: any;
  patient: any;
  
  categoryname: any
  subcat: any;
  subcategoryvalue: any
  sub_cat: any
  nextpage: boolean
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  discription: String;
  jobdeatails: any;
  submit: boolean = false;
  available_tasker: any
  skip = 0;
  limit = 3;
  minValue: number = 50;
  maxValue: number = 100;
  options = {
    floor: 50,
    ceil: 100
  } as any;
  dateValues: any;
  timeValues: any;
  timeValuesarry: any;
  showby_div = 0
  taskerlist: any
  maplist: any;
  imageUrl = CONFIG.imageUrl;
  taskerlistfilter: any;
  selectedtime: any;
  selectdate: any
  count: any
  settingsdata: any
  category_id: any
  date: any
  @ViewChild('search') searchElementRef: ElementRef;
  @ViewChild('childModal', { static: false }) childModal?: ModalDirective;
  taskerdata: any;
  userId: any;
  addressLists: any[] =[];

  constructor(private store: StoreService,
    private progress: ProgressService, private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone, private route: ActivatedRoute, private toastrservice: ToastrService, private toastr: AlertService, private router: Router) {
    this.currentuser = JSON.parse(localStorage.getItem('currentuser'));
    this.userId = this.currentuser.user_id

    this.store.landingdata.subscribe((result: any) => {
      this.settingsdata = result.settings;
    });
  }

  ngOnInit(): void {
    var dateStart = moment(new Date()).format('DD-MMMM-YYYY');

    var dateEnd = moment(new Date()).add(30, 'days').format('DD-MMMM-YYYY');
    this.dateValues = Array.from(moment.range(moment(dateStart), moment(dateEnd)).by('day'));
    this.date = new Date()
    var now = moment();
    console.log(now, 'now');

    var currenttime = moment(now);
    var starttime = moment().startOf('day');
    const times = 24 * 2;
    let timelist = [];
    for (let i = 0; i < times; i++) {
      timelist.push(moment(starttime).add(30 * i, 'minutes'));
    }
    console.log(timelist, 'pppppp');

    this.timeValuesarry = timelist;
    this.timeValues = timelist.map(function (s) { return moment(s) }).filter(function (m) { return m.isSameOrAfter(currenttime) });
    console.log(this.timeValues, '-------------');

    // this.route.paramMap.subscribe(res => {
    //   this.categoryname = res.get('id')
    //   console.log(this.categoryname);
    //   localStorage.setItem('cat_id', this.categoryname)


    // })
    this.store.landingdata.subscribe((result: any) => {
      this.Category = result.categories;
      console.log(this.Category);

      this.postheader = result.postheader;
      this.peoplecmd = result.peoplecmd;
      this.posttasks = result.posttask;
      this.categories = result.categories;
      if (result.appearance) {
        this.appearance = result.appearance.filter(x => x.imagefor == 'bannerpage').length > 0 ? result.appearance.filter(x => x.imagefor == 'bannerpage')[0] : {};
      }
      // this.elementRef.nativeElement.querySelector('.home-container').click();
    });
    // setTimeout(() => {
    //   this.category_id = this.Category.filter((x) => {
    //     if (x._id == this.categoryname) {
    //       return x
    //     }
    //   })

    //   const data = {
    //     slug: this.category_id[0].slug
    //   };
    //   this.progress.Getsubcategory(data).subscribe(result => {
    //     console.log(result.status);

    //     if (result.status == 1) {
    //       this.Subcategory = result.response;
    //       console.log(this.Subcategory);


    //     }
    //   });
    //   // this.progress.Gettaskerdetails(data).subscribe(res => {
    //   //   if (res.status == 1) {
    //   //     this.available_tasker = res.response
    //   //     console.log(this.available_tasker, ' this.available_tasker-----------------------------------------------');

    //   //   }

    //   // })
    //   this.load()

    // }, 500);

    this.progress.addressList({user_id: this.userId}).subscribe(result=>{
      if(result && result.status == 1){
        this.addressLists = result && result.doc.addressList?result.doc.addressList:[];
        console.log("this.addressLists", this.addressLists)
      }
    })

  }
  Categorychange(event) {
    console.log(event.target.value);
    if(event.target && event.target.value){

      const data = {
        slug: event.target.value
      };
      this.maincategoryvalue = event.target.value;
  
      this.category_id = this.Category.filter((x) => {
        if (x._id == event.target.value) {
          return x
        }
      })
  
      const slug = {
        slug: this.category_id[0].slug
      };
      this.progress.Gettaskerdetails(slug).subscribe(res => {
        if (res.status == 1) {
          this.available_tasker = res.response;
        }
      })
    }


    // this.progress.Getsubcategory(data).subscribe(result => {
    //   if (result.status === 1) {
    //     this.subcat.nativeElement.value = '';
    //     this.Subcategory = result.response;
    //     console.log(this.Subcategory);

    //     // this.elementRef.nativeElement.querySelector('.home-container').click();
    //     // setTimeout(() => {
    //     //   this.hidespinner();
    //     // }, 1000);
    //   }
    // });
  }
  Subcategorychange(event) {
    this.subcategoryvalue = event.target.value;
  }
  Cat_language(item, type) {
    if (type == 'Category') {
      if (typeof item.category_language != 'undefined' && isArray(item.category_language)) {
        if (localStorage.getItem('lang')) {
          var val = item.category_language.filter(x => x.lang_code == JSON.parse(localStorage.getItem('lang')).code)[0];
        }
        return val ? val.cate_name : item.cate_name;
      } else {
        return item.name;
      }
    }
    // } else if (type == 'postheader-title') {
    //   if (typeof item.postHeader != 'undefined' && isArray(item.postHeader)) {
    //     if (localStorage.getItem('lang')) {
    //       var val = item.postHeader.filter(x => x.lang_code == JSON.parse(localStorage.getItem('lang')).code)[0];
    //     }
    //     return val ? val.title : item.title;
    //   } else {
    //     return item.title;
    //   }
    // } else if (type == 'postheader-description') {
    //   if (typeof item.postHeader != 'undefined' && isArray(item.postHeader)) {
    //     if (localStorage.getItem('lang')) {
    //       var val = item.postHeader.filter(x => x.lang_code == JSON.parse(localStorage.getItem('lang')).code)[0];
    //     }
    //     return val ? val.description : item.description;
    //   } else {
    //     return item.description;
    //   }
    // } else if (type == 'posttask-name') {
    //   if (typeof item.postTask != 'undefined' && isArray(item.postTask)) {
    //     if (localStorage.getItem('lang')) {
    //       var val = item.postTask.filter(x => x.lang_code == JSON.parse(localStorage.getItem('lang')).code)[0];
    //     }
    //     return val ? val.name : item.name;
    //   } else {
    //     return item.name;
    //   }
    // } else if (type == 'posttask-description') {
    //   if (typeof item.postTask != 'undefined' && isArray(item.postTask)) {
    //     if (localStorage.getItem('lang')) {
    //       var val = item.postTask.filter(x => x.lang_code == JSON.parse(localStorage.getItem('lang')).code)[0];
    //     }
    //     return val ? val.description : item.description;
    //   } else {
    //     return item.description;
    //   }
    // }
    // else if(type == 'categories-name'){
    //   if(typeof item.category_language !='undefined' && isArray(item.category_language)){
    //     let val = item.category_language.filter(x=>x.lang_code == JSON.parse(localStorage.getItem('lang')).code)[0];
    //     return val ? val.name : item.name;
    //   }else{
    //     return item.name;
    //   }
    // }
  }
  nextPage(value) {
    
    if (this.currentuser) {
      var loc = value.location;
      this.latitude = loc.lat;
      this.longitude =loc.lng;
      const zip_code = value.zipcode;
      if (this.latitude && this.longitude != null) {
      
        let data = {
          lat: this.latitude,
          lon: this.longitude,
          categoryid:this.maincategoryvalue||'',
          category_hours: 2,
          timeout: false,
          date: moment(new Date()).format('DD-MMMM-YYYY'),
          time: moment(this.timeValues[0]).format('HH:mm'),

          sort: 1,
          view: this.showby_div == 0 ? 'list' : 'view',
          skip: this.skip,
          limit: this.limit
        } as any;
        console.log('this.available_tasker +++++++++++++++++++==', this.available_tasker)
        // if (this.available_tasker && this.available_tasker.filtersInit) {
        //   data.price = [this.available_tasker.filtersInit.pricemin, this.available_tasker.filtersInit.pricemax]
        // } else {
        //   data.price = [0, 0]
        // }
        this.get_tasker_list(data)
      } else {
        this.toastrservice.error("Enter the location")
      }
    } else {
      localStorage.setItem('Taskassign', JSON.stringify('taskerpage'));
      this.router.navigate(['/login']);
    }


    // if ((this.sub_cat && this.sub_cat != null) && (this.categoryname && this.categoryname != null)) {

    // } else {
    //   this.toastr.error("Form is invalid")
    // }
  }

  changeLocation(loc){
    if(loc && loc.value){
     var data = this.addressLists.find((e)=>{
        return e.patient == loc.value
      });
      if(data){
        this.nextPage(data)
      }

    }  
  }

  load() {
    this.mapsAPILoader.load().then(() => {
      // this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
      let autocomplete;
      autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });


      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.address = place.formatted_address;
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }


  markerDragEnd($event: MouseEvent) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          //this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }
  get_tasker_list(data) {
    setTimeout(() => {
      this.selectedtime = moment(this.timeValues[0]).format('HH:mm');
      console.log(this.selectedtime);
      
      this.selectdate = moment(new Date()).format('DD-MMMM-YYYY');
      this.progress.Taskeravailability(data).subscribe(result => {
        if (result.status == 1) {
          if (result.response.count >= 1) {
            // let allTask = result.tasklist;
            // let allTaskers = result.response.taskers;
            // for (let i = 0; i < allTask.length; i++) {
            //   for (let j = 0; j < allTaskers.length; j++) {
            //     if (allTask[i].tasker.tasker_id == allTaskers[j]._id) {
            //       if (allTask[i].task_details && allTask[i].task_details.task_time == this.selectedtime && (allTask[i].status == 2 || allTask[i].status == 3 || allTask[i].status == 4 || allTask[i].status == 5)) {
            //         allTaskers.splice(j, 1)
            //       }
            //     }
            //   }
            // }
            // this.taskerlist = allTaskers;
            // console.log(this.taskerlist);
            result.response.taskers.forEach(x => {
              x.selected = false
            });
            this.maplist = result.response.taskers;
            this.count = result.count;
            this.taskerlistfilter = result.response.taskers;
            console.log(this.taskerlistfilter);
  
            // if (data.view == 'list') {
            //   this.taskerlist = this.showbyPrice(this.priceValue.nativeElement.value);
            // }
            // this.cd.detectChanges();
          }
        } else {
          //this.errorsmsg(result.response);
        }
      })
    }, 100);


   
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
      lat: this.latitude,
      lon: this.longitude,
      categoryid: (this.available_tasker&&this.available_tasker.category._id)?this.available_tasker.category._id:'',
      category_hours: 2,
      // categoryid: this.cateogryid.category._id,
      // category_hours: this.cateogryid.category.SubCategoryInfo.hours,
      timeout: false,
      date: moment(this.selectdate).format('DD-MMMM-YYYY') ? moment(this.selectdate).format('DD-MMMM-YYYY') : moment(new Date()).format('DD-MMMM-YYYY'),
      time: this.selectedtime,
      sort: 1,
      view: this.showby_div == 0 ? 'list' : 'view',
      skip: this.skip,
      limit: this.limit
    } as any
    if (this.available_tasker && this.available_tasker.filtersInit) {
      data.price = [this.available_tasker.filtersInit.pricemin, this.available_tasker.filtersInit.pricemax]
    } else {
      data.price = [0, 0]
    }
    this.progress.Taskeravailability(data).subscribe(result => {
      if (result.status == 1) {
        if (result.count >= 1) {
          this.taskerlist = result.response.taskers;
          this.maplist = result.response.taskers;
          this.count = result.count;
          this.taskerlistfilter = result.response.taskers;
          // if(this.taskerlist.length > 0 && this.count > 2){
          //   this.elementRef.nativeElement.querySelector('#clear-btn-pagination').click();
          // }
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
        // this.errorsmsg(result.response);
      }
    })
  }
  timechange(event) {
    this.selectedtime = event.target.value;
    let data = {
      lat: this.latitude,
      lon: this.longitude,
      categoryid: this.available_tasker.category._id,
      category_hours: 2,
      timeout: false,
      date: moment(this.selectdate).format('DD-MMMM-YYYY') ? moment(this.selectdate).format('DD-MMMM-YYYY') : moment(new Date()).format('DD-MMMM-YYYY'),
      time: this.selectedtime,

      // price: [this.cateogryid.filtersInit.pricemin, this.cateogryid.filtersInit.pricemax],
      sort: 1,
      view: this.showby_div == 0 ? 'list' : 'view',
      skip: this.skip,
      limit: this.limit
    } as any
    if (this.available_tasker && this.available_tasker.filtersInit) {
      data.price = [this.available_tasker.filtersInit.pricemin, this.available_tasker.filtersInit.pricemax]
    } else {
      data.price = [0, 0]
    }
    this.progress.Taskeravailability(data).subscribe(result => {
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
        // this.errorsmsg(result.response);
      }
    })
  }
  taskers(data) {
    this.taskerlistfilter.forEach(x => {
      if (x._id == data._id) {
        x.selected = true
      } else {
        x.selected = false
      }
    })
    this.taskerdata = data

  }
  nextConfirmpage() {
    if (this.taskerdata) {
      $(document).ready(function () {

        var current_fs, next_fs, previous_fs; //fieldsets
        var opacity;
        var current = 1;
        var steps: number = $("fieldset").length;
        let bar: number = 100 / steps

        setProgressBar(current);

        $("#uniquetasker").click(function () {

          current_fs = $(this).parent().parent();
          next_fs = $(this).parent().parent().next();

          //Add Class Active
          $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

          //show the next fieldset
          next_fs.show();
          //hide the current fieldset with style
          current_fs.animate({ opacity: 0 }, {
            step: function (now) {
              // for making fielset appear animation
              opacity = 1 - now;

              current_fs.css({
                'display': 'none',
                'position': 'relative'
              });
              next_fs.css({ 'opacity': opacity });
            },
            duration: 500
          });
          setProgressBar(++current);
        });

        $(".previous").click(function () {

          current_fs = $(this).parent().parent();
          previous_fs = $(this).parent().parent().prev();

          //Remove class active
          $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

          //show the previous fieldset
          previous_fs.show();

          //hide the current fieldset with style
          current_fs.animate({ opacity: 0 }, {
            step: function (now) {
              // for making fielset appear animation
              opacity = 1 - now;

              current_fs.css({
                'display': 'none',
                'position': 'relative'
              });
              previous_fs.css({ 'opacity': opacity });
            },
            duration: 500
          });
          setProgressBar(--current);
        });

        function setProgressBar(curStep) {
          console.log(curStep);

          var percent: any = bar * curStep;
          percent = percent.toFixed();
          $(".progress-bar")
            .css("width", percent + "%")
        }

        $(".submit").click(function () {
          return false;
        })

      });
    } else {
      this.toastrservice.error("Select the caregiver")
    }


  }
  confirmTasker() {
    let Category = this.category_id[0]
    let location = {} as any
    location.lat = this.latitude
    location.long = this.longitude
    let data = {} as any;
    data = {
      hour_rate: this.taskerdata.taskerskills.hour_rate,
      tasker: {
        tasker_id: this.taskerdata._id,
        username: this.taskerdata.username,
        avatar: this.taskerdata.avatar ? this.taskerdata.avatar : '',
        phone: this.taskerdata.phone,
        email: this.taskerdata.email,
        status: this.taskerdata.status,
        location: this.taskerdata.location
      },
      taskers: [{
        tasker_id: this.taskerdata._id,
        username: this.taskerdata.username,
        status: 1
      }],
      category: {
        _id: Category._id,
        name: Category.name,
        commision: Category.commision,
        admincommision: Category.admincommision,
        hour_time: Category.hours,
        parent_id: Category._id,
        slug: Category.slug,
        ratetype: Category.ratetype,
      },
      address: this.address,
      location: location,
      description: 'test',
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
      this.progress.addnewtask(data).subscribe((result: any) => {
        if (result.status === 0) {
          // this.hidespinner();
          // this.errorsmsg(result.response);
        } else {
          // this.successmsg(result.response);
          this.childModal.show()

          this.store.notificationemit.next('newnotification');
          setTimeout(() => {
            // this.hidespinner();
            this.childModal.show()
            localStorage.setItem('showtab', 'Detailstab');
            this.router.navigate(['/account/job-details']);
          }, 3000);

        }
      });
    }
    // else {
    //   // this.hidespinner();

    // }
  }

}
