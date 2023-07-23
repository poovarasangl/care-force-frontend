import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { AccountComponent } from '../account.component';
import { AlertService } from '../../alert/alert.service';
import { SpinnerService } from 'src/app/spinner/spinner.service';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.sass']
})
export class AvailabilityComponent implements OnInit {
  Workinfoform: FormGroup;

  // google maps zoom level
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  @ViewChild('search') searchElementRef: ElementRef;
	@ViewChild('allWeek') weekElementRef: ElementRef;
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
  profiledata: any;
  wholeday: any;
  address_err: any;
  agm_address ={
		line1:'',
		line2: '',
		city: '',
		state: '',
		country: '',
		zipcode: '',
		formatted_address: ''
	}
  constructor(private toastr : AlertService,
    private formBuilder: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private ApiService: AccountService,
    private router: Router,
    private homepage: AccountComponent,
    private spinner: SpinnerService, ) {
    this.Workinfoform = this.formBuilder.group({
      workingdays: ['', [Validators.required]],
      Wholedays: ['', [Validators.required]],
      selectedtime: ['']
    });
  }

  ngOnInit() {
    localStorage.setItem('showtab', 'Availabilitytab');
    this.ApiService.Profiledetails.subscribe(result => {
      this.hidespinner();
      this.profiledata = result;
      this.address = this.profiledata.availability_address;
      this.agm_address = this.profiledata.address;
      if (this.profiledata.availability_address && this.profiledata.working_days.length > 0) {
        this.profiledata.working_days.forEach(item => {
          this.seletedtimeslot(item);
        })
      }
    });

    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
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
          this.agm_address['formatted_address'] = place.formatted_address;
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
          this.geocode();
        });
      });
    });
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        if(this.profiledata &&this.profiledata.location){
          this.latitude = this.profiledata.location.lat;
          this.longitude = this.profiledata.location.lng;
        }else{
          this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        }
        this.zoom = 12;
        this.getAddress(this.latitude, this.longitude);
        this.geocode();
      });
    }
  }
	geocode() {
		const geocoder = new google.maps.Geocoder();
	  
		const latlng = new google.maps.LatLng(this.latitude, this.longitude);
	  
		geocoder.geocode({ 'location': latlng }, (results, status) => {
			if (status === google.maps.GeocoderStatus.OK) {
		
				if (results[0]) {
					this.agm_address['zipcode'] = results[0].address_components[results[0].address_components.length - 1].long_name;
					this.agm_address['country'] = results[0].address_components[results[0].address_components.length - 2].short_name;
					this.agm_address['state'] = results[0].address_components[results[0].address_components.length - 3].long_name;
					this.agm_address['city'] = results[0].address_components[results[0].address_components.length - 4].long_name;
					this.agm_address['line2'] = results[0].address_components[results[0].address_components.length - 5].long_name;
					this.agm_address['line1'] = results[0].address_components[results[0].address_components.length - 6].long_name;
					
				}
			}
		  });
	}

  markerDragEnd($event: MouseEvent) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress1(this.latitude, this.longitude);
    this.geocode();
  }
  getAddress1(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
          this.agm_address['formatted_address'] = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
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

  WholeDayselet(event, name) {
    const checked = event.target.checked;
		let selecteddays = this.dayslist.filter(x => x.Day == name);
		if (event.target.value) {
			selecteddays[0].timelist.forEach(item => item.selected = checked);
		}
		if(checked){
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

  updateworkinginfo() {
    if (!this.address) {
      this.address_err = 'Address is required'
      return;
    }
    this.showspinner();
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
      if(this.address == this.profiledata.availability_address){
        data = {
          _id: this.profiledata._id,
          working_days: workingdays,
          provider_location: { provider_lat: this.profiledata.location.lat, provider_lng: this.profiledata.location.lng },
          location: {lng: this.profiledata.location.lng,lat: this.profiledata.location.lat},
          availability_address: this.address,
          type : 'doc',
          address: this.agm_address
        };
      }else{
        data = {
          _id: this.profiledata._id,
          working_days: workingdays,
          provider_location: { provider_lat: this.latitude, provider_lng: this.longitude },
          location: { lng: this.longitude,lat: this.latitude },
          availability_address: this.address,
          type : 'doc',
          address: this.agm_address
        };
      }      
      this.ApiService.updatetaskerprofile(data).subscribe(result => {
        this.hidespinner();
        if (result.status == 1) {
          this.successmsg('Update successfully!!');
          this.homepage.ngOnInit();
        } else {
          this.errorsmsg(result.response);
        }
      })
    } else if (selectcheck.length == 0) {
      this.hidespinner();
      if (!this.wholeday) {
        this.warningmsg('Please Select Atleast One Day');
        return;
      }
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
