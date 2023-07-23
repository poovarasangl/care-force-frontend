import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../alert/alert.service';
import { RegisterService } from './register.service';
import { StoreService } from '../store/store.service';
import { SpinnerService } from '../spinner/spinner.service';
import { CONFIG } from '../config';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
  encapsulation: ViewEncapsulation.None

})
export class RegisterComponent implements OnInit {
  @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;
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

  constructor(
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

  onSubmit() {
    console.log(this.Getotp);

    this.submittedphone = true;
    const data = {} as any
    this.getotp_btn = 1;
    this.showspinner();
    setTimeout(() => {
      data.phone = JSON.parse(this.mobilenumber.nativeElement.value);

      this.Logindata = data;
      // stop here if form is invalid       
      if (this.number == '') {
        this.mobilelength = 'Phone number is required';
        this.getotp_btn = 0;
        this.hidespinner();
        return;
      } else if (!data.phone.valid) {
        this.mobilelength = 'Invalid Mobile Number';
        this.getotp_btn = 0;
        this.hidespinner();
        return;
      }
      if (this.Getotp === 1) {
        data.userrole = 'user';
      } else {
        data.userrole = 'tasker';
      }
      if (this.number != '' && data.phone.valid === true) {
        this.getuserdata(data);
      } else {
        this.hidespinner();
      }
    }, 2000);
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
        localStorage.setItem('currentuser', JSON.stringify(result.response));
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

}
