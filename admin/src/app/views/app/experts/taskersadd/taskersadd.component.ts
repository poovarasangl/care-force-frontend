import { Component, OnInit, ViewChild, TemplateRef, ElementRef, NgZone } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { MapsAPILoader, Marker, MouseEvent } from '@agm/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { AdminService, Apiconfig, AuthenticationService } from "src/app/_services";
import { NotificationsService, NotificationType } from 'angular2-notifications';
import * as moment from "moment";

@Component({
  selector: 'app-taskersadd',
  templateUrl: './taskersadd.component.html',
  styleUrls: ['./taskersadd.component.sass']
})
export class TaskersaddComponent implements OnInit {
 
  isCollapsed = false;
  @ViewChild('ExpertsTabs', { static: false }) ExpertsTabs: TabsetComponent;
  @ViewChild('form') form: NgForm;
  @ViewChild('taskerdocform') taskerdocform: NgForm;
  @ViewChild('addressform') addressform: NgForm;
  @ViewChild('catform') catform: NgForm;
  @ViewChild('qusform') qusform: NgForm;
  @ViewChild('allWeek') weekElementRef: ElementRef;
  @ViewChild('search') searchElementRef: ElementRef;

  private geoCoder;

  buttonDisabled = false;
  buttonState = '';
  imageUrl: string = environment.apiUrl;
  countrycode = '';
  modalRef: BsModalRef;
  nextrue: boolean = false;
  nextruetwo: boolean = false;
  skip: number = 0;
  limit: number = 10;
  imagepreview = {
    image: '' as string | ArrayBuffer,
    doc: '' as string | ArrayBuffer,
    doc2: '' as string | ArrayBuffer,
  }
  wholeday: any;
  taboneform: boolean;
  questionslist: any;
  categorylist: any;
  subcat: any;
  catrate: any;
  ratetype: any;
  commission: any;
  defaultcurrencysymbol: any;
  activeexplist: any;
  showerror: boolean;
  documentslist: any;
  nextruethree: boolean = false;
  nextruefour: boolean;
  opentababt: boolean = false;
  latitude: number;
  longitude: number;
  zoom: number;
  agm_address = {
    line1: '',
    line2: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
    formatted_address: ''
  }
  catformvalues: any;
  addedcategory = [] as any;
  removablecategory: any;
  taskersavedata = {
    address: {
      line1 : '',
      line2 : '',
      line3 :'',
      city : '',
      state : '',
      country : '',
      zipcode : '',
      formatted_address : ''
    },
    country_code: '',
    availability_address: '',
    avatar: '',
    avatarBase64: '' as string | ArrayBuffer,
    banking: {},
    birthdate: {},
    doc: [{}],
    document_status: '',
    email: '',
    firstname: '',
    gender: '',
    lastname: '',
    location: {
      lat: '',
      lng: ''
    },
    phone: {
      code: '',
      number: ''
    },
    profile_details: [{}],
    role: '',
    status: '',
    taskerskills: [{}],
    temp_availability_address: '',
    username: '',
    working_days: [{}],
  }
  updatableplace: google.maps.places.PlaceResult;
  address: any;

  dayslist = [
    {
      Day: 'Sunday', selected: false, wholeday: 0,
      timelist: [{ time: '12AM - 1AM', selected: false }, { time: '1AM - 2AM', selected: false }, { time: '2AM - 3AM', selected: false },
      { time: '3AM - 4AM', selected: false }, { time: '4AM - 5AM', selected: false }, { time: '5AM - 6AM', selected: false },
      { time: '6AM - 7AM', selected: false }, { time: '7AM - 8AM', selected: false }, { time: '8AM - 9AM', selected: false },
      { time: '9AM - 10AM', selected: false }, { time: '10AM - 11AM', selected: false }, { time: '11AM - 12PM', selected: false },
      { time: '12PM - 1PM', selected: false }, { time: '1PM - 2PM', selected: false }, { time: '2PM - 3PM', selected: false },
      { time: '3PM - 4PM', selected: false }, { time: '4PM - 5PM', selected: false }, { time: '5PM - 6PM', selected: false },
      { time: '6PM - 7PM', selected: false }, { time: '7PM - 8PM', selected: false }, { time: '8PM - 9PM', selected: false },
      { time: '9PM - 10PM', selected: false }, { time: '10PM - 11PM', selected: false }, { time: '11PM - 12AM', selected: false }
      ]
    },
    {
      Day: 'Monday', selected: false, wholeday: 0,
      timelist: [{ time: '12AM - 1AM', selected: false }, { time: '1AM - 2AM', selected: false }, { time: '2AM - 3AM', selected: false },
      { time: '3AM - 4AM', selected: false }, { time: '4AM - 5AM', selected: false }, { time: '5AM - 6AM', selected: false },
      { time: '6AM - 7AM', selected: false }, { time: '7AM - 8AM', selected: false }, { time: '8AM - 9AM', selected: false },
      { time: '9AM - 10AM', selected: false }, { time: '10AM - 11AM', selected: false }, { time: '11AM - 12PM', selected: false },
      { time: '12PM - 1PM', selected: false }, { time: '1PM - 2PM', selected: false }, { time: '2PM - 3PM', selected: false },
      { time: '3PM - 4PM', selected: false }, { time: '4PM - 5PM', selected: false }, { time: '5PM - 6PM', selected: false },
      { time: '6PM - 7PM', selected: false }, { time: '7PM - 8PM', selected: false }, { time: '8PM - 9PM', selected: false },
      { time: '9PM - 10PM', selected: false }, { time: '10PM - 11PM', selected: false }, { time: '11PM - 12AM', selected: false }
      ]
    },
    {
      Day: 'Tuesday', selected: false, wholeday: 0,
      timelist: [{ time: '12AM - 1AM', selected: false }, { time: '1AM - 2AM', selected: false }, { time: '2AM - 3AM', selected: false },
      { time: '3AM - 4AM', selected: false }, { time: '4AM - 5AM', selected: false }, { time: '5AM - 6AM', selected: false },
      { time: '6AM - 7AM', selected: false }, { time: '7AM - 8AM', selected: false }, { time: '8AM - 9AM', selected: false },
      { time: '9AM - 10AM', selected: false }, { time: '10AM - 11AM', selected: false }, { time: '11AM - 12PM', selected: false },
      { time: '12PM - 1PM', selected: false }, { time: '1PM - 2PM', selected: false }, { time: '2PM - 3PM', selected: false },
      { time: '3PM - 4PM', selected: false }, { time: '4PM - 5PM', selected: false }, { time: '5PM - 6PM', selected: false },
      { time: '6PM - 7PM', selected: false }, { time: '7PM - 8PM', selected: false }, { time: '8PM - 9PM', selected: false },
      { time: '9PM - 10PM', selected: false }, { time: '10PM - 11PM', selected: false }, { time: '11PM - 12AM', selected: false }
      ]
    },
    {
      Day: 'Wednesday', selected: false, wholeday: 0,
      timelist: [{ time: '12AM - 1AM', selected: false }, { time: '1AM - 2AM', selected: false }, { time: '2AM - 3AM', selected: false },
      { time: '3AM - 4AM', selected: false }, { time: '4AM - 5AM', selected: false }, { time: '5AM - 6AM', selected: false },
      { time: '6AM - 7AM', selected: false }, { time: '7AM - 8AM', selected: false }, { time: '8AM - 9AM', selected: false },
      { time: '9AM - 10AM', selected: false }, { time: '10AM - 11AM', selected: false }, { time: '11AM - 12PM', selected: false },
      { time: '12PM - 1PM', selected: false }, { time: '1PM - 2PM', selected: false }, { time: '2PM - 3PM', selected: false },
      { time: '3PM - 4PM', selected: false }, { time: '4PM - 5PM', selected: false }, { time: '5PM - 6PM', selected: false },
      { time: '6PM - 7PM', selected: false }, { time: '7PM - 8PM', selected: false }, { time: '8PM - 9PM', selected: false },
      { time: '9PM - 10PM', selected: false }, { time: '10PM - 11PM', selected: false }, { time: '11PM - 12AM', selected: false }
      ]
    },
    {
      Day: 'Thursday', selected: false, wholeday: 0,
      timelist: [{ time: '12AM - 1AM', selected: false }, { time: '1AM - 2AM', selected: false }, { time: '2AM - 3AM', selected: false },
      { time: '3AM - 4AM', selected: false }, { time: '4AM - 5AM', selected: false }, { time: '5AM - 6AM', selected: false },
      { time: '6AM - 7AM', selected: false }, { time: '7AM - 8AM', selected: false }, { time: '8AM - 9AM', selected: false },
      { time: '9AM - 10AM', selected: false }, { time: '10AM - 11AM', selected: false }, { time: '11AM - 12PM', selected: false },
      { time: '12PM - 1PM', selected: false }, { time: '1PM - 2PM', selected: false }, { time: '2PM - 3PM', selected: false },
      { time: '3PM - 4PM', selected: false }, { time: '4PM - 5PM', selected: false }, { time: '5PM - 6PM', selected: false },
      { time: '6PM - 7PM', selected: false }, { time: '7PM - 8PM', selected: false }, { time: '8PM - 9PM', selected: false },
      { time: '9PM - 10PM', selected: false }, { time: '10PM - 11PM', selected: false }, { time: '11PM - 12AM', selected: false }
      ]
    },
    {
      Day: 'Friday', selected: false, wholeday: 0,
      timelist: [{ time: '12AM - 1AM', selected: false }, { time: '1AM - 2AM', selected: false }, { time: '2AM - 3AM', selected: false },
      { time: '3AM - 4AM', selected: false }, { time: '4AM - 5AM', selected: false }, { time: '5AM - 6AM', selected: false },
      { time: '6AM - 7AM', selected: false }, { time: '7AM - 8AM', selected: false }, { time: '8AM - 9AM', selected: false },
      { time: '9AM - 10AM', selected: false }, { time: '10AM - 11AM', selected: false }, { time: '11AM - 12PM', selected: false },
      { time: '12PM - 1PM', selected: false }, { time: '1PM - 2PM', selected: false }, { time: '2PM - 3PM', selected: false },
      { time: '3PM - 4PM', selected: false }, { time: '4PM - 5PM', selected: false }, { time: '5PM - 6PM', selected: false },
      { time: '6PM - 7PM', selected: false }, { time: '7PM - 8PM', selected: false }, { time: '8PM - 9PM', selected: false },
      { time: '9PM - 10PM', selected: false }, { time: '10PM - 11PM', selected: false }, { time: '11PM - 12AM', selected: false }
      ]
    },
    {
      Day: 'Saturday', selected: false, wholeday: 0,
      timelist: [{ time: '12AM - 1AM', selected: false }, { time: '1AM - 2AM', selected: false }, { time: '2AM - 3AM', selected: false },
      { time: '3AM - 4AM', selected: false }, { time: '4AM - 5AM', selected: false }, { time: '5AM - 6AM', selected: false },
      { time: '6AM - 7AM', selected: false }, { time: '7AM - 8AM', selected: false }, { time: '8AM - 9AM', selected: false },
      { time: '9AM - 10AM', selected: false }, { time: '10AM - 11AM', selected: false }, { time: '11AM - 12PM', selected: false },
      { time: '12PM - 1PM', selected: false }, { time: '1PM - 2PM', selected: false }, { time: '2PM - 3PM', selected: false },
      { time: '3PM - 4PM', selected: false }, { time: '4PM - 5PM', selected: false }, { time: '5PM - 6PM', selected: false },
      { time: '6PM - 7PM', selected: false }, { time: '7PM - 8PM', selected: false }, { time: '8PM - 9PM', selected: false },
      { time: '9PM - 10PM', selected: false }, { time: '10PM - 11PM', selected: false }, { time: '11PM - 12AM', selected: false }
      ]
    }];
  address_err: string;
  phonedata = {
    email: '',
    phone: {
      code: '',
      number: ''
    }
  } as any;
  generalsettingsdata: any;
  showdocoption: boolean = false;
  docstatus: any;
  docfileData: [];
  docreq: boolean;
  documenttaskerForm: FormGroup;
  phonevalid: boolean;
  diffInDays: number;
  agelimitbar: boolean;
  curentUser: any;
  userPrivilegeDetails: any;
  access: boolean = true;
  
  constructor(private modalService: BsModalService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private AdminService: AdminService,
    private notifications: NotificationsService,
    private router: Router,
    private authService: AuthenticationService,
    private ActivatedRoute: ActivatedRoute,
  ) {
    this.curentUser = this.authService.currentUserValue;
    if (this.curentUser && this.curentUser.user_details && this.curentUser.user_details.role == "subadmin") {
      if (this.ActivatedRoute.snapshot.routeConfig.component.name == 'TaskersaddComponent') {
        let data = this.curentUser.user_details.privileges.filter(x => x.alias == 'tasker');
        this.userPrivilegeDetails = data.length > 0 ? data[0].status : {};
      }
    }
  }

  ngOnInit(): void {
    this.settingapi();
    this.AdminService.CommonApi('post', Apiconfig.taskersquslist, {}).subscribe(
      (results) => {
        if (results.status == 1) {
          this.questionslist = results.response;
        }
      })
    this.AdminService.CommonApi('get', Apiconfig.taskercatlist, {}).subscribe(
      (results) => {
        if (results.status == 1) {
          this.categorylist = results.response;
        }
      })
    this.AdminService.CommonApi('get', Apiconfig.taskerdefaultcurrency, {}).subscribe(
      (results) => {
        if (results.status == 1) {
          this.defaultcurrencysymbol = results.response;
        }
      })
    let data = {
      'skip': this.skip,
      'limit': this.limit
    }
    this.AdminService.CommonApi('post', Apiconfig.experiencelist, data).subscribe(
      (results) => {
        if (results.status == 1) {
          this.activeexplist = results.response;
        }
      })
    this.AdminService.CommonApi('post', Apiconfig.taskerdocumentslist, {}).subscribe(
      (results) => {
        this.documentslist = results.response;
        var group = {}
			if (results.status === 1) {
				results.response.forEach(template => {
					if (template.mandatory == 1) {
							group[template.replace_name] = new FormControl('', Validators.required);
							group[template.replace_name_back] = new FormControl('', Validators.required);
						} else {
								group[template.replace_name] = new FormControl('');
								group[template.replace_name_back] = new FormControl('');
              }
            })
          }
			this.documenttaskerForm = new FormGroup(group);
      })
      localStorage.removeItem('addedcategory');

      if(localStorage.getItem('addedcategory') != null){
        this.addedcategory = JSON.parse(localStorage.getItem('addedcategory'));
      }
  }
  ngAfterViewInit(){
    this.loadmap();
    localStorage.removeItem('addedcategory');
    setTimeout(() => {
      if(this.ExpertsTabs && this.ExpertsTabs.tabs){
        this.ExpertsTabs.tabs[1].disabled = true;
        this.ExpertsTabs.tabs[2].disabled = true;
        this.ExpertsTabs.tabs[3].disabled = true;
        if(this.showdocoption = true){
          this.ExpertsTabs.tabs[4].disabled = true;
        }
      }
    }, 500);
  }

  selectTab(tabId: number) {
    if (tabId == 1) {
      if (this.form.valid) {
        this.phoneCheck();
        this.DateCheck();
        setTimeout(() => {
          if(this.phonevalid == true && this.agelimitbar == false){
            this.nextrue = false;
            this.ExpertsTabs.tabs[tabId].disabled = false;
            this.ExpertsTabs.tabs[tabId].active = true;
            this.ExpertsTabs.tabs[2].disabled = true;
            this.ExpertsTabs.tabs[3].disabled = true;
            this.ExpertsTabs.tabs[4].disabled = true;
          }
        }, 500);
       
      } else {
      console.log(';;;;;;;;;;;;;;;;;;;;;_______________+=============')
        this.nextrue = true;
        this.ExpertsTabs.tabs[tabId].disabled = true;
        this.ExpertsTabs.tabs[2].disabled = true; 
        this.ExpertsTabs.tabs[3].disabled = true;
        this.ExpertsTabs.tabs[4].disabled = true;
        this.notifications.create('Error', 'Please enter all madatory fields', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
      }
    }
    if (tabId == 2) {
        this.nextruetwo = false;
        this.ExpertsTabs.tabs[tabId].disabled = false;
        this.ExpertsTabs.tabs[tabId].active = true;
        this.ExpertsTabs.tabs[3].disabled = true;
        this.ExpertsTabs.tabs[4].disabled = true;
    } else if (tabId == 3) {
      if(this.addedcategory.length > 0){
        this.nextruethree = false;
        this.ExpertsTabs.tabs[tabId].disabled = false;
        this.ExpertsTabs.tabs[tabId].active = true;   
        this.ExpertsTabs.tabs[4].disabled = true;
      }else{
        this.nextruethree = true;
        this.ExpertsTabs.tabs[tabId].disabled = true;
        this.ExpertsTabs.tabs[4].disabled = true;
        this.notifications.create('Error', 'Please select atleast one category', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
      }
    } else if (tabId == 4) {
      let workdatas = {} as any;
      workdatas = this.updateworkinginfo();
      if(workdatas != undefined){
        this.nextruefour = false;
        this.ExpertsTabs.tabs[tabId].disabled = false;
        this.ExpertsTabs.tabs[tabId].active = true;
      }else{
        this.nextruefour = true;
        this.ExpertsTabs.tabs[tabId].disabled = true;
        this.notifications.create('Error', 'Please select working Slots', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
      }
    }
  }

  mapClicked($event: MouseEvent) {

  }
  
  DateCheck(){
    console.log(new Date);
    console.log(this.form.form.value.basicDate);    
    var entereddate = this.form.form.value.basicDate
    this.diffInDays = (new Date()).valueOf() - (new Date(entereddate)).valueOf();
    let approxyear =  this.diffInDays / 3.154e+10;
    console.log(approxyear);
    if(approxyear < 18){
      this.agelimitbar = true;
      this.notifications.create('Error', 'Age should be 18 or more!', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
    }else{
      this.agelimitbar = false;
    }
  }
  oncountryChange(event) {
    this.countrycode = '+' + event.dialCode;
  }
  getNumber(event) {
  }

  telInputObject(event) {
    //obj.intlTelInput('setNumber', this.phonenumber);
  }
  next() {

  }
  settingapi(){
    this.AdminService.CommonApi('get', Apiconfig.getSettingsData, {}).subscribe
    ((results)=>{
      this.generalsettingsdata = results.response;
      this.docstatus = this.generalsettingsdata.settings.document_upload.status
      if(this.docstatus == 1){
        this.showdocoption = true;
      }else{
        this.showdocoption = false;
      }
    })
  }
  convertfile(event) {

  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }
  confirm(catform : NgForm): void {
    this.catformvalues = catform.form.value;
    console.log(this.catformvalues);
    
    if(catform.form.invalid){
      this.notifications.create('Error', 'Please enter all madatory fields', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
      return
    }else{
      this.addedcategory.push(this.catformvalues);
      localStorage.setItem('addedcategory', JSON.stringify(this.addedcategory));
      this.modalRef.hide(); 
      this.notifications.create('Success', 'Categories added successfully', NotificationType.Success, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
      this.ratetype = '';
      catform.reset();
    }
  } 
  addedcat(catid){
    console.log(catid,'cateoooooo')
    if(catid != '' && this.categorylist){      
      let categoryname = this.categorylist.filter(x =>  x._id.toString() === catid.toString());
      if(categoryname.length > 0){
        return categoryname[0].name;
      }else{
        return '';
      }
    }
  }
  removecat(categoryid){
    this.removablecategory = JSON.parse(localStorage.getItem(('addedcategory')));
    let index = this.removablecategory.findIndex(x => { return x.categoryid.toString() === categoryid.toString() });
    if (index > -1) {
      this.removablecategory.splice(index, 1);
    }
    localStorage.setItem('addedcategory', JSON.stringify(this.removablecategory));
    this.addedcategory = this.removablecategory;
  }
  Categorychange(event) {
    console.log(event);
    
    let index = this.categorylist.findIndex(x => { return x._id.toString() === event.target.value.toString() });

    if (index !== -1) {
      this.subcat = this.categorylist[index]
      this.ratetype = this.subcat.ratetype;
      this.commission = this.subcat.commision;

    } else {
      this.subcat = '';
      
    }
  }
  subcategorycommision(event) {
    let index = this.subcat.findIndex(x => { return x._id.toString() === event.target.value.toString() });
    if (index !== -1) {
      this.catrate = this.subcat[index];
      this.ratetype = this.catrate.ratetype;
      this.commission = this.catrate.commision;
    } else {
      this.catrate = '';
    }

  }
  minimumrate(event) {
    if (event.target.value < this.commission) {
      this.showerror = true;
    } else {
      this.showerror = false;
    }
  }

  getFiles(event, item, key) {
    const imgbytes = event.target.files[0].size;
    const imgtype = event.target.files[0].type;
    if(key == 'image'){
      this.preview(event.target.files[0], key)
    }
    if (imgtype == 'image/jpeg' || imgtype == 'image/png' || imgtype == 'image/gif' || imgtype == 'image/jpg') {
      if (Math.round(parseInt(imgbytes) / 1024) > 1024) {
        this.notifications.create('Error', 'Maximum image size should be 1MB', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
      } else {
        // this.taskersavedata.append(key, event.target.files[0], event.target.files[0]['name']);
        let data = new FormData();
        data.append(key, event.target.files[0]);
        this.AdminService.CommonApi('post', Apiconfig.taskeruploaddocuments, data).subscribe
        ((results)=>{
          if(results.status == 1){
            if(key == "front"){
              var updatedoc = {
                file_type: results.response[0].mimetype,
                name: item.name,
                path: results.response[0].path,
                replace_name: item.replace_name,
                stripe: item.stripe,
                _id: item._id,
              }
            }else{
              var updatedoc = {
                file_type: results.response[0].mimetype,
                name: item.name,
                path: results.response[0].path,
                replace_name:  item.replace_name_back,
                stripe: item.stripe,
                _id: item._id,
              }
            }
            this.taskersavedata.doc.push(updatedoc);
          }          
        })
      }
    } else {

    }
  }
  preview(files, key) {
    // Show preview
    var mimeType = files.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(files);
    reader.onload = (_event) => {
      this.imagepreview[key] = reader.result;
    }
  }
  seletedtimeslot(selectedtime) {
    for (let i = 0; i < this.dayslist.length; i++) {
      if (selectedtime.day == this.dayslist[i].Day) {
        for (let j = 0; j < this.dayslist[i].timelist.length; j++) {
          if (selectedtime.wholeday == 1) {
            this.dayslist[i].wholeday = 1;
            this.dayslist[i].selected = true;
            this.dayslist[i].timelist[j].selected = true;
          } else if (selectedtime.wholeday == 0) {
            this.dayslist[i].selected = true;
            for (let k = 0; k < selectedtime.slots.length; k++) {
              if (j == selectedtime.slots[k]) {
                this.dayslist[i].timelist[j].selected = true;
              }
            }
          }
        }
      }
    }
  }
  wholeweek(event) {
    const checked = event.target.checked;
    this.wholeday = checked;
    this.dayslist.forEach(item => item.selected = checked);
    if (checked) {
      this.dayslist.forEach(item => item.wholeday = 1);
    } else {
      this.dayslist.forEach(item => item.wholeday = 0);
    }
    for (var i = 0; i < this.dayslist.length; i++) {
      for (var j = 0; j < this.dayslist[i].timelist.length; j++) {
        this.dayslist[i].timelist[j].selected = checked;
      }
    }

  }
  WholeDayselet(event, name) {
    const checked = event.target.checked;
    let selecteddays = this.dayslist.filter(x => x.Day == name);
    if (event.target.value) {
      selecteddays[0].timelist.forEach(item => item.selected = checked);
    }
    if (checked) {
      selecteddays[0].selected = true;
      selecteddays[0].wholeday = 1;
      this.weekElementRef.nativeElement.checked = this.dayslist.every((e) => {
        return e.selected == true
      })
    } else {
      selecteddays[0].selected = false;
      selecteddays[0].wholeday = 0;
      this.weekElementRef.nativeElement.checked = checked;
    }
  }
  timeslot(event, dayselect, timeselect) {
    for (var i = 0; i < this.dayslist.length; i++) {
      if (this.dayslist[i].Day == dayselect.Day) {
        for (var j = 0; j < this.dayslist[i].timelist.length; j++) {
          if (this.dayslist[i].timelist[j].time == timeselect.time) {
            this.dayslist[i].timelist[j].selected = event.target.checked;
          }
        }
        let wholedayselect = this.dayslist[i].timelist.every(e => {
          return e.selected == true;
        })
        wholedayselect == true ? this.dayslist[i].wholeday = 1 : this.dayslist[i].wholeday = 0;
      }
    }
  }
  adddocument() {

  }
  loadmap() {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();          
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
          this.updatableplace = place; 
          console.log(this.updatableplace,'iikkkkkkkkkkkkkkkkkkkkkk');
                   
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
  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;       
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }
  geocode() {
    const geocoder = new google.maps.Geocoder();

    const latlng = new google.maps.LatLng(this.latitude, this.longitude);

    geocoder.geocode({ 'location': latlng }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
console.log('results',results)
        if (results[0] && results[0].address_components && results[0].address_components.length > 0) {
          this.agm_address['zipcode'] = results[0].address_components[8].long_name;
          this.agm_address['country'] = results[0].address_components[7].long_name;
          this.agm_address['state'] = results[0].address_components[6].long_name;
          this.agm_address['city'] = results[0].address_components[5].long_name;
          this.agm_address['line3'] = results[0].address_components[3].long_name;
          this.agm_address['line2'] = results[0].address_components[2].long_name;
          this.agm_address['line1'] = results[0].address_components[1].long_name;
        }
      }
    });
  }
  phoneCheck(){
    let datas = {
      data : { }
    } as any
    datas.data = this.phonedata;
    this.phonedata.email = this.form.form.value.email;
    if(this.countrycode != undefined || this.countrycode != ''){
      this.phonedata.phone.code = this.countrycode;
    }else{

    }
    this.phonedata.phone.code = '+91';
    this.phonedata.phone.number = this.form.form.value.phone;
    
    this.AdminService.CommonApi('post', Apiconfig.taskerphonecheck, datas).subscribe
    ((results)=>{
      if(results.status == 1){
        this.phonevalid = true;
      }else{
        this.phonevalid = false;
        this.notifications.create('Error', results.response, NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
      }
    })
  }
  markerDragEnd($event: MouseEvent) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }
  updateworkinginfo() {
    if (!this.address) {
      this.address_err = 'Address is required'
      return;
    }
    this.address_err = '';
    let selectcheck = this.dayslist.filter(x => x.selected == true);
    var workingdays = [] as any;
    for (let i = 0; i < selectcheck.length; i++) {
      let testdata = []
      selectcheck[i].timelist.forEach((item, index) => {
        if (item.selected === true) {
          testdata.push(index)
        }
      });
      workingdays.push({ slots: testdata, day: selectcheck[i].Day, selected: selectcheck[i].selected, wholeday: selectcheck[i].wholeday })
    }

    if (selectcheck.length > 0) {
      var data = {}
        data = {
          working_days: workingdays,
          provider_location: { provider_lat: this.latitude, provider_lng: this.longitude },
          location: { lng: this.longitude,lat: this.latitude },
          availability_address: this.address,
          type : 'doc',
          address: this.agm_address
        };
        return data;
    };
  }
  
  onSubmit() {
    if (this.userPrivilegeDetails && this.userPrivilegeDetails.add != true && !this.ActivatedRoute.snapshot.paramMap.get('id')) {
      this.access = false;
      this.notifications.create('Warning', "Can't access the page.", NotificationType.Warn, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
    } else if (this.userPrivilegeDetails && this.userPrivilegeDetails.edit != true && this.ActivatedRoute.snapshot.paramMap.get('id')) {
      this.access = false;
      this.notifications.create('Warning', "Can't access the page.", NotificationType.Warn, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
    } else {
      this.docreq = true
    if(this.documenttaskerForm.invalid){
      return
    }
    var working = {} as any;
    working = this.updateworkinginfo();
    let generalform = this.form.form.value;
    let profiledatasquslist = [];
    for (let index = 0; index < this.questionslist.length; index++) {      
      profiledatasquslist.push({answer:this.questionslist[index].answer,question:this.questionslist[index]._id})
    }
    if(this.updatableplace != undefined){
      this.taskersavedata.address.line1 = this.updatableplace.address_components[0].long_name?this.updatableplace.address_components[0].long_name:'';
      this.taskersavedata.address.line2 = this.updatableplace.address_components[1].long_name ?this.updatableplace.address_components[1].long_name:'';
      this.taskersavedata.address.line3 = this.updatableplace.address_components[2].long_name ?this.updatableplace.address_components[2].long_name:'';
      this.taskersavedata.address.city = this.updatableplace.address_components[3].long_name?this.updatableplace.address_components[3].long_name:'';
      this.taskersavedata.address.state = this.updatableplace.address_components[4].long_name?this.updatableplace.address_components[4].long_name:'';
      this.taskersavedata.address.country = this.updatableplace.address_components[5].long_name ?  this.updatableplace.address_components[5].long_name:'';
      this.taskersavedata.address.zipcode = this.updatableplace.address_components[6].long_name ?this.updatableplace.address_components[6].long_name:'';
      this.taskersavedata.address.formatted_address = this.updatableplace.formatted_address ?this.updatableplace.formatted_address:''
      this.taskersavedata.availability_address=this.updatableplace.formatted_address;
      this.taskersavedata.country_code = this.updatableplace.address_components[6].short_name;
    }else{
      this.taskersavedata.address= this.address;
      this.taskersavedata.availability_address=this.address;
    }
    this.taskersavedata.avatarBase64 = this.imagepreview.image ? this.imagepreview.image : '';
    this.taskersavedata.avatar = generalform.avatar;
    this.taskersavedata.email = generalform.email;
    this.taskersavedata.firstname = generalform.firstname;
    this.taskersavedata.lastname = generalform.lastname;
    this.taskersavedata.gender = generalform.gender;
    this.taskersavedata.status = generalform.status;
    this.taskersavedata.username = generalform.firstname +' '+ generalform.lastname;
    this.taskersavedata.birthdate = {
      date: moment(generalform.basicDate).format('DD'),
      month: moment(generalform.basicDate).format('MM'),
      year: moment(generalform.basicDate).format('YYYY')
    }
    // this.taskersavedata.about = this.questionslist.question;
    this.taskersavedata.profile_details = profiledatasquslist;
    this.taskersavedata.role= "tasker"
    this.taskersavedata.phone.code = this.countrycode;
    this.taskersavedata.phone.number = generalform.phone;
    this.taskersavedata.taskerskills = this.addedcategory;
    this.taskersavedata.location = working.location;
    this.taskersavedata.working_days = working.working_days ;

    if(this.taskersavedata != undefined){
      this.AdminService.CommonApi('post', Apiconfig.taskersave, this.taskersavedata).subscribe
      ((results)=>{
        if(results.status == 1){
          this.buttonDisabled = false;
          this.buttonState = 'show-spinner';
          this.addedcategory = ''
          localStorage.removeItem('addedcategory');
          this.notifications.create('Success', 'Profile saved successfully', NotificationType.Success, { theClass: 'outline', timeOut: 3000, showProgressBar: true });           
          setTimeout(() => {
            this.router.navigate(['app/experts/taskers/taskerlist']);
          }, 1000);
        }else{
          this.buttonState = '';
          this.notifications.create('Error', 'Unable to save data', NotificationType.Error, { theClass: 'outline', timeOut: 3000, showProgressBar: true });
        }
      })
    }
  }
  }
}
