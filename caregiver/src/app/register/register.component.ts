import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, ChangeDetectorRef, NgZone, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../alert/alert.service';
import { RegisterService } from './register.service';
import { StoreService } from '../store/store.service';
import { SpinnerService } from '../spinner/spinner.service';
import { CONFIG } from '../config';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { MapsAPILoader, Marker, MouseEvent } from '@agm/core';
import { isArray } from 'util';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
  encapsulation: ViewEncapsulation.None

})
export class RegisterComponent implements OnInit {
  @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;
  @ViewChild('form') form: NgForm;
  private geoCoder;
  updatableplace: google.maps.places.PlaceResult;
  latitude: any;
  longitude: any;
  @ViewChild('search') searchElementRef: ElementRef;
  Getotp = 1;
  Registerform: FormGroup;
  Phonecheck: FormGroup;
  otpvalue: any;
  retUrl: any;
  regeater_btn = 0;
  mobilelength: string;
  getotp_btn = 0;
  checkotp: any;
  phonecheckform = 1;
  registerpage = 0;
  submitted: boolean;
  submittedphone: boolean;
  errors: number;
  email: any;
  phone: any;
  verifyotp_btn = 0;
  otperror = '';
  Userreg = true;
  TaskerReg = false;
  number: any;
  taskdata: any;
  jobdetails = true;
  viewexperts = false;
  type = 'slug';
  viewexpertstab = 'none';
  routerurl: string;
  Logindata: any;
  landingdata: any;
  appearance: any;
  imageUrl = CONFIG.imageUrl;
  @ViewChild('mobilenumber') mobilenumber: ElementRef;
  address: any ={};
  countrycode = '';
  phonenumber = "";
  experiencelist: any;
  Category: any;
  maincategoryvalue: string = '';
  taskerskills: any []=[];

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private formBuilder: FormBuilder,
    private ApiService: RegisterService,
    private router: Router,
    private elementRef: ElementRef,
    private toastr: AlertService,
    private store: StoreService,
    private spinner: SpinnerService,
    private cd: ChangeDetectorRef) {
    this.Phonecheck = this.formBuilder.group({
      phone: ['', Validators.required],
      otp: ['']
    });
    this.routerurl = this.router.url;
    this.store.Url.next(this.routerurl);
    this.store.landingdata.subscribe((result: any) => {
      if (result.appearance) {
        let file = result.appearance.filter(x => x.imagefor == 'loginpage').length > 0 ? result.appearance.filter(x => x.imagefor == 'loginpage')[0] : { image: '' };
        this.appearance = {};
        this.appearance.image = this.imageUrl + file.image;
      } else {
        this.appearance = {};
        this.appearance.image = 'assets/images/Default/homepage.jpeg';
      }
    });

    this.Registerform = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      referalcode: [''],
      checkbox: ['', [Validators.requiredTrue]]
    });
  }

  onSelect(data: TabDirective): void {
    if (data.heading == 'CareForce') {
      this.tab2();
    } else if (data.heading == 'User') {
      this.tab1();
    }
  }

  ngOnInit() {
    this.loadmap()
    this.countrycode = "+91";
    this.store.landingdata.subscribe((data: any) => {
      if (data) {
        this.landingdata = data;
      }
    })
    this.hidespinner();
    this.taskdata = localStorage.getItem('Taskassign');
    localStorage.removeItem('Prosonalinfo');
    localStorage.removeItem('WorkInfo');
    localStorage.removeItem('DocumentsInfo');
    localStorage.removeItem('Categoryinfo');
    localStorage.removeItem('registerphone');
    const script1 = document.createElement('script');
    script1.src = 'assets/intel/intlTelInput.js';
    script1.async = false;
    script1.defer = true;
    this.elementRef.nativeElement.appendChild(script1);
    const script2 = document.createElement('script');
    script2.src = 'assets/intel/utils.js';
    script2.async = false;
    script2.defer = true;
    this.elementRef.nativeElement.appendChild(script2);
    const script = document.createElement('script');
    script.src = 'assets/intel/codepen.js';
    script.async = false;
    script.defer = true;
    this.elementRef.nativeElement.appendChild(script);
    const script3 = document.createElement('script');
    script3.type = 'text/javascript';
    script3.src = 'assets/intel/intel.js';
    script3.async = false;
    script3.charset = 'utf-8';
    this.elementRef.nativeElement.appendChild(script3);

    this.ApiService.Getexperiencedetailas().subscribe(result => {
      if (result.status == 1) {
        this.experiencelist = result.response;
        console.log('this.experiencelist', this.experiencelist)
      }
    });

    this.store.landingdata.subscribe((result: any) => {
      this.Category = result.categories;
    });
  }
  tab1() {
    const script3 = document.createElement('script');
    script3.type = 'text/javascript';
    script3.src = 'assets/intel/intel.js';
    script3.async = false;
    script3.charset = 'utf-8';
    this.elementRef.nativeElement.appendChild(script3);
    this.Userreg = true;
    this.TaskerReg = false;
    this.submittedphone = false;
    this.Phonecheck.reset();
    this.phone = '';
    this.Getotp = 1;
    this.mobilelength = '';
    this.number = '';
    this.verifyotp_btn = 0;
    this.otperror = '';
  }
  tab2() {
    const script4 = document.createElement('script');
    script4.type = 'text/javascript';
    script4.src = 'assets/intel/intel-tasker.js';
    script4.async = false;
    script4.charset = 'utf-8';
    this.elementRef.nativeElement.appendChild(script4);
    this.Userreg = false;
    this.TaskerReg = true;
    this.registerpage = 0;
    this.phonecheckform = 1;
    this.submittedphone = false;
    this.verifyotp_btn = 0;
    this.Phonecheck.reset();
    this.phone = '';
    this.Getotp = 11;
    this.mobilelength = '';
    this.number = '';
    this.otperror = '';
  }
  get phonecheck() { return this.Phonecheck.controls; }

  oncountryChange(event) {
    this.countrycode = '+' + event.dialCode;
  }

  getNumber(event) {
    //console.log(event)
  }

  telInputObject(event) {
    //console.log(event)
    //obj.intlTelInput('setNumber', this.phonenumber);
  }

  onSubmit() {
    if(this.form.form.valid){
      var data = {} as any;
      const value= this.form.form.value;
      data.email = value.email
      data.firstname = value.firstname;
      data.lastname = value.lastname;
      data.address = this.address;
      data.taskerskills = this.taskerskills;
      data.user_type = 'tasker';
      data['phone'] = {
        'code': this.countrycode,
        'number': this.form.form.get('phone').value
      }
      console.log("data", data)
      this.ApiService.userRegister(data).subscribe(result=>{
        console.log("result", result)
        if(result && result.status == 1){
          result.response.expiresAt = new Date().getTime() + (1000 * 60 * 60 * 12);
          localStorage.setItem('currenttasker', JSON.stringify(result.response));
          this.store.Userdetails.next(result.response);
          this.successmsg('Successfully login!!');
          this.router.navigate(['']);
        } else{
          this.errorsmsg(result.response)
        }
      })
    } else{
      this.toastr.error('Please fill all the mandatory field')
    }
    // this.submittedphone = true;
    // const data = {} as any
    // this.getotp_btn = 1;
    // this.showspinner();
    // setTimeout(() => {
    //   data.phone = JSON.parse(this.mobilenumber.nativeElement.value);

    //   this.Logindata = data;
    //   // stop here if form is invalid       
    //   if (this.number == '') {
    //     this.mobilelength = 'Phone number is required';
    //     this.getotp_btn = 0;
    //     this.hidespinner();
    //     return;
    //   } else if (!data.phone.valid) {
    //     this.mobilelength = 'Invalid Mobile Number';
    //     this.getotp_btn = 0;
    //     this.hidespinner();
    //     return;
    //   }
    //   if (this.Getotp === 1) {
    //     data.userrole = 'user';
    //   } else {
    //     data.userrole = 'tasker';
    //   }
    //   if (this.number != '' && data.phone.valid === true) {
    //     this.getuserdata(data);
    //   } else {
    //     this.hidespinner();
    //   }
    // }, 2000);
  }
  getuserdata(data) {
    this.ApiService.phonenumbercheck(data).subscribe(result => {
      this.hidespinner();
      this.getotp_btn = 0;
      if (result.status == 0 && result.response != "Account Exists") {
        this.Getotpdata(data);
      } else if (result.response == "Account Exists") {
        this.errorsmsg('Already Account Exists')
      } else {
        this.errorsmsg(result.response)
      }
    })
  }

  Getotpdata(data) {
    this.ApiService.generateOtp(data).subscribe(result => {
      if (this.Getotp === 1) {
        this.Getotp = 2;
      } else {
        this.Getotp = 22;
      }
      if (result && typeof result.sms != 'undefined' && result.sms == 'development') {
        this.otpvalue = result.otpkey;
      }
      this.checkotp = result.otpkey;
    });
  }
  resendOtp(type) {
    if (type == 'user') {
      this.Getotp = 1;
    } else {
      this.Getotp = 2;
    }
    this.Getotpdata(this.Logindata);
  }

  verifyotp() {
    this.showspinner();
    this.verifyotp_btn = 1;
    const data = this.Phonecheck.value;
    data.phone = this.Logindata.phone;
    if (data.otp === this.checkotp) {
      this.hidespinner();
      if (this.Getotp == 2) {
        this.phonecheckform = 0;
        this.registerpage = 1;
      } else {
        localStorage.setItem('registerphone', JSON.stringify(data));
        this.router.navigate(['/tasker-register']);
      }
    } else {
      this.hidespinner();
      this.verifyotp_btn = 0;
      this.otperror = 'One time password invalid';
    }
  }

  get registrationform() { return this.Registerform.controls; }

  emailcheck(event) {
    var data = {
      email: event.target.value,
      table: 'users'
    }
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(event.target.value)) {
      this.ApiService.checkemail(data).subscribe(result => {
        if (result.status == 0) {
          this.email = '';
          this.errorsmsg(result.response);
        }
      })
    } else {
      this.errors = 1;
    }
  }
  Register() {
    this.submitted = true;
    if (this.Registerform.invalid) {
      return;
    }
    this.regeater_btn = 1;
    var data = this.Registerform.value;
    data.phone = this.Logindata.phone;
    data.referral = this.landingdata.settings.referral.amount;
    this.ApiService.userregister(data).subscribe(result => {
      if (result.status == 1) {
        result.response.expiresAt = new Date().getTime() + (1000 * 60 * 60 * 12);
        localStorage.setItem('currenttasker', JSON.stringify(result.response));
        this.store.Userdetails.next(result.response);
        if (this.taskdata) {
          this.regeater_btn = 0;
          let slugname = JSON.parse(localStorage.getItem('selectedcategory'));
          this.type = slugname.subcategory;
          if (localStorage.getItem('seletedtabtask') === 'veiw-experts') {
            this.jobdetails = false;
            this.viewexpertstab = 'auto';
            this.viewexperts = true;
            this.router.navigate(['/task/view-experts', this.type]);
          } else {
            this.router.navigate(['/task/job-details', this.type]);
          }
        } else {
          this.regeater_btn = 0;
          this.successmsg('Successfully login!!');
          this.router.navigate(['']);
        }
      } else {
        this.regeater_btn = 0;
        this.errorsmsg(result.response);
      }
    })
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

  loadmap() {
    // this.mapsAPILoader.load().then(() => {

    //   this.setCurrentLocation();
    //   this.geoCoder = new google.maps.Geocoder;
    //   let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      
  
    //   autocomplete.addListener("place_changed", () => {
    //     this.ngZone.run(() => {
    //       //get the place result
    //       let place: google.maps.places.PlaceResult = autocomplete.getPlace();
    //       this.address.address = place.formatted_address;
    //       this.address['formatted_address'] = place.formatted_address;
    //       //verify result
    //       if (place.geometry === undefined || place.geometry === null) {
    //         return;
    //       }
  
    //       //set latitude, longitude and zoom
    //       this.latitude = place.geometry.location.lat();
    //       this.longitude = place.geometry.location.lng();
    //       this.address.location = {
    //         lat: place.geometry.location.lat(),
    //         lng: place.geometry.location.lng()
    //       };
    //       this.zoom = 12;
    //       this.geocode();
    //     });
    //   });
    // })
    this.mapsAPILoader.load().then(() => {
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
          var locationa = place
          // for (var i = 0; i < locationa.address_components.length; i++) {
          //   for (var j = 0; j < locationa.address_components[i].types.length; j++) {
          //     if (locationa.address_components[i].types[j] == 'neighborhood') {
          //       if (this.address.line1 != locationa.address_components[i].long_name) {
          //         if (this.address.line1 != '') {
          //           this.address.line1 = this.address.line1 + ',' + locationa.address_components[i].long_name;
          //         } else {
          //           this.address.line1 = locationa.address_components[i].long_name;
          //         }
          //       }
          //     }
          //     if (locationa.address_components[i].types[j] == 'route') {
          //       if (this.address.line1 != locationa.address_components[i].long_name) {
          //         if (this.address.line2 != '') {
          //           this.address.line2 = this.address.line2 + ',' + locationa.address_components[i].long_name;
          //         } else {
          //           this.address.line2 = locationa.address_components[i].long_name;
          //         }
          //       }
      
          //     }
          //     if (locationa.address_components[i].types[j] == 'street_number') {
          //       if (this.address.line2 != '') {
          //         this.address.line2 = this.address.line2 + ',' + locationa.address_components[i].long_name;
          //       } else {
          //         this.address.line2 = locationa.address_components[i].long_name;
          //       }
      
          //     }
          //     if (locationa.address_components[i].types[j] == 'sublocality_level_1') {
          //       if (this.address.line2 != '') {
          //         this.address.line2 = this.address.line2 + ',' + locationa.address_components[i].long_name;
          //       } else {
          //         this.address.line2 = locationa.address_components[i].long_name;
          //       }
      
          //     }
          //     if (locationa.address_components[i].types[j] == 'locality' || locationa.address_components[i].types[j] == 'postal_town' || locationa.address_components[i].types[j] == 'administrative_area_level_2' || locationa.address_components[i].types[j] == 'administrative_area_level_1') {
      
          //       this.address.city = locationa.address_components[i].long_name;
          //     }
          //     if (locationa.address_components[i].types[j] == 'country') {
      
          //       this.address.country = locationa.address_components[i].long_name;
          //     }
          //     if (locationa.address_components[i].types[j] == 'postal_code') {
      
          //       this.address.zipcode = locationa.address_components[i].long_name;
          //     }
          //     if (locationa.address_components[i].types[j] == 'administrative_area_level_1' || locationa.address_components[i].types[j] == 'administrative_area_level_2') {
          //       this.address.state = locationa.address_components[i].short_name;
          //     }
          //   }
          // }
          this.address.formatted_address= place.formatted_address;
          this.address.line1 = place.formatted_address;
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.updatableplace = place;
          this.address.location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          this.geocode();
          // this.zoom = 12;
                   
        });
      });
    });
  }
  geocode() {
		const geocoder = new google.maps.Geocoder();
	  
		const latlng = new google.maps.LatLng(this.latitude, this.longitude);
	  
		geocoder.geocode({ 'location': latlng }, (results, status) => {
			if (status === google.maps.GeocoderStatus.OK) {
				if (results[0]) {
					this.address.zipcode = results[0].address_components[results[0].address_components.length - 1].long_name;
					this.address.country = results[0].address_components[results[0].address_components.length - 2].short_name;
					this.address.state = results[0].address_components[results[0].address_components.length - 3].long_name;
					this.address.city = results[0].address_components[results[0].address_components.length - 4].long_name;
					this.address.line2 = results[0].address_components[results[0].address_components.length - 5].long_name;
					this.address.line1 = results[0].address_components[results[0].address_components.length - 6].long_name;
          this.address.city = results[0].address_components[results[0].address_components.length - 4].long_name;
          this.address.zipcode = results[0].address_components[results[0].address_components.length - 1].long_name;
				}
			}
		  });
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
  }

  Categorychange(event) {
    console.log(event.target.value);
    this.taskerskills = []
    const data = {
      slug: event.target.value
    };
    this.maincategoryvalue = event.target.value;
    var skill = {
      categoryid: this.maincategoryvalue,
      experience: this.experiencelist[1]._id,
      hour_rate: 100
    }
    this.taskerskills.push(skill);
  }
}
