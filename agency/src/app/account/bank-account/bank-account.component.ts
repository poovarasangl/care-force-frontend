import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../../alert/alert.service';
import { AccountService } from '../account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountComponent } from '../account.component';
import { SpinnerService } from '../../spinner/spinner.service';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.sass']
})
export class BankAccountComponent implements OnInit {

  bankaccountform: FormGroup;
  submitted = false;
  profiledata:any;
  save_btn = 0;
  country: string;
  document1 :string | ArrayBuffer=null;
  document2 :string | ArrayBuffer=null;
  imagepreview = {
    image : '' as string | ArrayBuffer,
  }
  imagepreview1 = {
    image : '' as string | ArrayBuffer,
	}
  constructor(
    private router: Router,
    private toastr : AlertService,
    private Apiservice: AccountService,
    private formBuilder: FormBuilder,
    private ApiService: AccountService,
    private homepage: AccountComponent,
    private spinner: SpinnerService,) {
    this.bankaccountform = this.formBuilder.group({
      acc_holder_name: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9]{0,30}")]],
      acc_number: ['', [Validators.required, Validators.pattern("[0-9]{0,20}")]],
      bank_name: ['', [Validators.required, Validators.pattern("[a-zA-Z]{0,30}")]],
      routing_number: ['', [Validators.required, Validators.pattern("[0-9]{0,20}")]],
      ssn: ['']
    });
  }

  ngOnInit() {
    localStorage.setItem('showtab', 'Accounttab');
    this.ApiService.Profiledetails.subscribe(result => {
      this.hidespinner();  
      if(result){
        this.profiledata = result;
        if(this.profiledata != ''){
          if(this.profiledata.address.country != ''){
            this.country = this.profiledata.address.country;
            if(this.country == 'US'){
              this.bankaccountform.controls['ssn'].setValidators([Validators.required]);         
              
            }
          }
        }
        
      }
    });
  }
  get bankform() { return this.bankaccountform.controls; }

  onSubmit() {
    this.submitted = true;
    
    // stop here if form is invalid
		if (this.bankaccountform.invalid) {
			return;
    }
    this.showspinner();
    this.save_btn = 1;
    var data = this.bankaccountform.value;
    data._id = this.profiledata._id;
    data.type = 'Account';
    this.ApiService.updatetaskerprofile(data).subscribe(result =>{
      this.hidespinner();
      this.save_btn = 0;
      if(result.status == 1){
        this.homepage.ngOnInit();
        this.ngOnInit();
        this.successmsg('Account successfull updated!!');
      } else{
        this.errorsmsg(result.response);
      }    
    });
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
