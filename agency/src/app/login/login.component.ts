import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { StoreService } from '../store/store.service';
import { AlertService } from '../alert/alert.service';
import { SpinnerService } from '../spinner/spinner.service';
import { CONFIG } from "../config";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  Getotp = 1;
  Loginform: FormGroup;
  otpvalue: any;
  retUrl: any;
  mobilelength: any;
  getotp_btn = 0;
  verifyotp_btn = 0;
  submitted = false;
  checkotp: any;
  number: string = '';
  taskdata: any;
  jobdetails = true;
  viewexperts = false;
  Userreg = true;
  TaskerReg = false;
  type = 'slug';
  viewexpertstab = 'none';
  routerurl: string;
  Logindata: any;
  resendMobile: any;
  appearance: any;
  imageUrl = CONFIG.imageUrl;
  @ViewChild('mobilenumber') mobilenumber: ElementRef;


  constructor(private formBuilder: FormBuilder,
    private ApiService: LoginService,
    private router: Router,
    private toastr: AlertService,
    private store: StoreService,
    private elementRef: ElementRef,
    private spinner: SpinnerService,
  ) {
    this.Loginform = this.formBuilder.group({
      phone: ['', [Validators.required, Validators.max(10)]],
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
  }
  ngOnInit() {
    this.taskdata = localStorage.getItem('Taskassign');
    this.retUrl = localStorage.getItem('retUrl');
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
    this.hidespinner();
  }

  tab1() {
    const script3 = document.createElement('script');
    script3.type = 'text/javascript';
    script3.src = 'assets/intel/intel.js';
    script3.async = false;
    this.Userreg = true;
    this.TaskerReg = false;
    script3.charset = 'utf-8';
    this.elementRef.nativeElement.appendChild(script3);
    this.Getotp = 1;
    this.mobilelength = '';
    this.number = '';
  }
  tab2() {
    this.Userreg = false;
    this.TaskerReg = true;
    const script4 = document.createElement('script');
    script4.type = 'text/javascript';
    script4.src = 'assets/intel/intel-tasker.js';
    script4.async = false;
    script4.charset = 'utf-8';
    this.elementRef.nativeElement.appendChild(script4);
    this.number = '';
    this.Getotp = 11;
    this.mobilelength = '';
  }

  get loginform() { return this.Loginform.controls; }

  onSubmituser() {
    this.showspinner();
    this.submitted = true;
    const data = {} as any
    this.getotp_btn = 1;
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
        this.mobilelength = 'Invalid Mobile Number.';
        this.getotp_btn = 0;
        this.hidespinner();
        return;
      }
      // if (this.Getotp === 1) {
      //   data.userrole = 'user';
      // } else {
      //   data.userrole = 'tasker';
      // }
      this.Getotp = 1
      data.userrole = 'user';
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
      if (result.status === 1) {
        this.Getotpdata(data);
      } else {
        this.errorsmsg(result.response);
      }
    })
  }
  resendOtp(type) {
    // if (type == 'user') {
    //   this.Getotp = 1;
    // } else {
    //   this.Getotp = 2;
    // }
    this.Getotpdata(this.Logindata);
  }
  Getotpdata(data) {
    this.ApiService.generateOtp(data).subscribe(result => {
      // if (this.Getotp === 1) {
        this.Getotp = 2;
      // } else {
      //   this.Getotp = 22;
      // }
      if (result && typeof result.sms != 'undefined' && result.sms == 'development') {
        this.otpvalue = result.otpkey;
      }
      this.checkotp = result.otpkey;
    });
  }
  verifyotp() {
    this.showspinner();
    this.verifyotp_btn = 1;
    this.retUrl = localStorage.getItem('retUrl');
    const data = this.Logindata;
    if (this.Loginform.value.otp === this.checkotp) {
      // if (this.Getotp === 2) {
      //   data.userrole = 'user';
      // } else {
      //   data.userrole = 'tasker';
      // }
      data.userrole = 'user';
      this.ApiService.Login(data).subscribe(result => {
        this.verifyotp_btn = 0;
        this.hidespinner();
        if (result.status === 1) {
          result.response.expiresAt = new Date().getTime() + (1000 * 60 * 60 * 12);
          localStorage.setItem('currentuser', JSON.stringify(result.response));
          this.store.Userdetails.next(result.response);
          console.log(this.taskdata, "this.taskdata");

          if (this.taskdata) {
            console.log('0--------------------->>>>>>>>>>>>>>>>>>>>');

            let cat_id = localStorage.getItem('cat_id');
            this.type = cat_id;
            console.log(this.type);

            // if (localStorage.getItem('seletedtabtask') === 'veiw-experts') {
            //   this.jobdetails = false;
            //   this.viewexpertstab = 'auto';
            //   this.viewexperts = true;
            //   this.router.navigate(['/jobdetails',this.type]);
            // } else {
            this.router.navigate(['jobdetails']);
            // }FF
          } else {
            this.successmsg('Successfully login!!');
            this.router.navigate(['']);
          }
        } else {
          this.errorsmsg(result.response);
          this.router.navigate(['/login']);
        }
      })
    } else {
      this.hidespinner();
      this.verifyotp_btn = 0;
      this.errorsmsg('One time password invalid');
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