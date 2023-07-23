import { Component, ElementRef, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../alert/alert.service';
import { SpinnerService } from '../spinner/spinner.service';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { StoreService } from '../store/store.service';
import { AppService } from "../app.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.sass']
})
export class ContactusComponent implements OnInit {

  ContancusForm: FormGroup;
  submitted:boolean = false;
  save_btn : number = 0;
  mobilelength:string='';
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  @ViewChild('search') searchElementRef: ElementRef;
  @ViewChild('mobilenumber') mobilenumber: ElementRef;
  settings:any;
  
  constructor(
    private formBuilder: FormBuilder,
    private elementRef: ElementRef,
    private spinner: SpinnerService,
    private toastr: AlertService,
    private mapsAPILoader: MapsAPILoader,
    private store : StoreService,
    private ngZone: NgZone,
    private ApiService : AppService,
    private router : Router
  ) {
    this.ContancusForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });
    this.store.landingdata.subscribe(
      (result:any)=>{
        if(result && result.settings && result.settings.location){
            this.address = result.settings.location;
            this.settings = result.settings;
        }
      });
  }

  get form() { return this.ContancusForm.controls; }

  ngOnInit(): void {
    window.scrollTo(0, 0);
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
    this.setCurrentLocation();
  }
    // Get Current Location Coordinates
    private setCurrentLocation() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.zoom = 12;
        });
      }
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    setTimeout(() => {
      const script3 = document.createElement('script');
    script3.type = 'text/javascript';
    script3.src = 'assets/intel/intel.js';
    this.elementRef.nativeElement.appendChild(script3);

    this.mapsAPILoader.load().then(() => {
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

    }, 1000);
  }

  onSubmit() {
		this.submitted = true;
		let data = {} as any;
		this.save_btn = 1;	
		setTimeout(() => {
		if (this.ContancusForm.invalid) {
			this.save_btn = 0;
			return;
		}
		this.showspinner();		
		data = this.ContancusForm.value;
			if(!JSON.parse(this.mobilenumber.nativeElement.value).valid){
				this.hidespinner();
				this.save_btn = 0;
				this.mobilelength = 'Invalid Mobile Number.';
				return;
			}else{
				this.mobilelength = '';
				data.phone = JSON.parse(this.mobilenumber.nativeElement.value);
      }
    data.phone.number = data.phone.number.replace(/ +/g, "");
    data.mobile =  data.phone.dialCode +"-"+data.phone.number;
    delete data.phone;
    this.ApiService.SavecontactUs(data).subscribe(result => {
      if(result && result.status == 1){
        this.successmsg('Successfully Added!!');
        this.router.navigate(['']);
      }else{
        this.errorsmsg(result.response);
      }
    })
	}, 2000);
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
