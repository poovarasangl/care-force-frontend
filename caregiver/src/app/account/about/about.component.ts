import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountComponent } from '../account.component';
import { AlertService } from '../../alert/alert.service';
import { SpinnerService } from '../../spinner/spinner.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.sass']
})
export class AboutComponent implements OnInit {

  TaskerAboutForm: FormGroup;
  profiledata: any;
  submit:boolean = false;
  constructor(private ApiService: AccountService,
    private formBuilder: FormBuilder,
    private toastr: AlertService,
    private homepage: AccountComponent,
    private spinner: SpinnerService, ) {

    this.TaskerAboutForm = this.formBuilder.group({
      aboutyou: new FormControl('',[Validators.required, Validators.maxLength(250)]),
      aboutexperience: new FormControl('',[Validators.required, Validators.maxLength(250)]),
    });

  }

  ngOnInit() {
    localStorage.setItem('showtab', 'Abouttab');
    this.ApiService.Profiledetails.subscribe((result : any) => {      
      this.hidespinner();
      this.profiledata = result;
      if(result && result.about){
        console.log(this.profiledata);
        this.TaskerAboutForm.controls['aboutyou'].setValue(result.about ? result.about.aboutyou : '')
        this.TaskerAboutForm.controls['aboutexperience'].setValue(result.about ? result.about.aboutexperience : '')
      }
      
    })
  }
  get aboutform() { return this.TaskerAboutForm.controls; }
  onSubmit() {    
    this.submit = true;
    if(this.TaskerAboutForm.invalid){
      return false;
    }
      this.showspinner();
      let data = { about: { aboutyou: this.TaskerAboutForm.value.aboutyou, aboutexperience: this.TaskerAboutForm.value.aboutexperience } } as any;
      data._id = this.profiledata._id;
      data.role = this.profiledata.role;
      data.type = 'about';
      this.ApiService.updatetaskerprofile(data).subscribe(result => {
        this.hidespinner();
        if (result.status == 1) {
          this.submit = false;
          this.successmsg('Profile successfully updated!!');
          this.TaskerAboutForm.reset();
          this.homepage.ngOnInit();
        } else {
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
