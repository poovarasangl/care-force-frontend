import { Component, OnInit, ViewChild, TemplateRef, ElementRef, NgZone } from '@angular/core';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from "src/environments/environment";
import { MapsAPILoader, Marker, MouseEvent } from '@agm/core';
import { AlertService } from 'src/app/alert/alert.service';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.sass']
})
export class AddressComponent implements OnInit {
  @ViewChild('form') form: NgForm;
  private geoCoder;
  updatableplace: google.maps.places.PlaceResult;
  latitude: any;
  longitude: any;
  @ViewChild('search') searchElementRef: ElementRef;
  address:any = {};
  zoom: number;
  agm_address ={
		line1:'',
		line2: '',
		city: '',
		state: '',
		country: '',
		zipcode: '',
		formatted_address: ''
	};
  currentuser: any;
  userId: any;
  addressLists: any [] = [];
  editbtn: boolean = false;
  formatted_address1: any;
  zipcode1: any;
  city1: any;
  patient1: any;
  number1: any;
  id: any;
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private toastr : AlertService,
    private ApiService: AccountService,
  ) { 
    this.currentuser = JSON.parse(localStorage.getItem('currentuser'));
    this.userId = this.currentuser.user_id;
  }
  
  ngOnInit(): void {
    this.loadmap();
    if(this.userId){

      this.ApiService.addressList({user_id: this.userId}).subscribe(result=>{
        if(result && result.status == 1){
          this.addressLists = result && result.doc.addressList?result.doc.addressList:[];
          if(this.addressLists.length>0){
            this.editbtn = true;
          }
        }
      })
    }
  }

  clickBtn(){
    this.editbtn = false;
    setTimeout(()=>{
      this.loadmap();
    },200)
  }

  editAddrs(item){
    this.editbtn = false;
    this.patient1 = item.patient;
    this.number1 = item.number;
    this.formatted_address1 = item.address;
    this.city1 = item.city;
    this.zipcode1 = item.zipcode;
    this.latitude =  item && item.location.lat;
    this.longitude =  item && item.location.lng;
    this.id = item._id
    setTimeout(()=>{
      this.loadmap();
    },200)
  }

  deletAddrs(id){
    this.ApiService.DeleteAddress({id: id, userid: this.currentuser.user_id}).subscribe(result=>{
      if(result && result.status ==1){
        this.toastr.success(result.message || 'Updated successfully');
        this.ngOnInit();
      } else{
        this.toastr.error(result.message || 'Somthing went wrong')
      }
    })
  }

  updatepatient(){
    if(this.form.valid){
      var data = {
        user_id: this.currentuser.user_id,
        patient: this.form.form.value.patient,
        number: this.form.form.value.number,
        lat:this.latitude,
        lng: this.longitude,
        address: this.formatted_address1,
        zipcode: this.zipcode1,
        city: this.city1
      } as  any;

      if(this.id){
        data.id = this.id;
        data.patient = this.patient1;
        data.number = this.number1;
      }

      this.ApiService.SaveAddress(data).subscribe(result=>{
        if(result && result.status== 1){
          this.ngOnInit();
          this.toastr.success(result.message || 'address add successfull')
        } else{
          this.toastr.error(result.message || 'Something went wrong')
        }
      })
    
    }else{
      this.toastr.error('Please enter all mandatory field')
    }
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
          var locationa = place
          for (var i = 0; i < locationa.address_components.length; i++) {
            for (var j = 0; j < locationa.address_components[i].types.length; j++) {
              if (locationa.address_components[i].types[j] == 'neighborhood') {
                if (this.address.line1 != locationa.address_components[i].long_name) {
                  if (this.address.line1 != '') {
                    this.address.line1 = this.address.line1 + ',' + locationa.address_components[i].long_name;
                  } else {
                    this.address.line1 = locationa.address_components[i].long_name;
                  }
                }
              }
              if (locationa.address_components[i].types[j] == 'route') {
                if (this.address.line1 != locationa.address_components[i].long_name) {
                  if (this.address.line2 != '') {
                    this.address.line2 = this.address.line2 + ',' + locationa.address_components[i].long_name;
                  } else {
                    this.address.line2 = locationa.address_components[i].long_name;
                  }
                }
      
              }
              if (locationa.address_components[i].types[j] == 'street_number') {
                if (this.address.line2 != '') {
                  this.address.line2 = this.address.line2 + ',' + locationa.address_components[i].long_name;
                } else {
                  this.address.line2 = locationa.address_components[i].long_name;
                }
      
              }
              if (locationa.address_components[i].types[j] == 'sublocality_level_1') {
                if (this.address.line2 != '') {
                  this.address.line2 = this.address.line2 + ',' + locationa.address_components[i].long_name;
                } else {
                  this.address.line2 = locationa.address_components[i].long_name;
                }
      
              }
              if (locationa.address_components[i].types[j] == 'locality' || locationa.address_components[i].types[j] == 'postal_town' || locationa.address_components[i].types[j] == 'administrative_area_level_2' || locationa.address_components[i].types[j] == 'administrative_area_level_1') {
      
                this.address.city = locationa.address_components[i].long_name;
              }
              if (locationa.address_components[i].types[j] == 'country') {
      
                this.address.country = locationa.address_components[i].long_name;
              }
              if (locationa.address_components[i].types[j] == 'postal_code') {
      
                this.address.zipcode = locationa.address_components[i].long_name;
              }
              if (locationa.address_components[i].types[j] == 'administrative_area_level_1' || locationa.address_components[i].types[j] == 'administrative_area_level_2') {
                this.address.state = locationa.address_components[i].short_name;
              }
            }
          }
          this.address.formatted_address= place.formatted_address;
          this.address.line1 = place.formatted_address;
          this.formatted_address1 = place.formatted_address;
          // this.formatted_address1 = place.formatted_address;
          // this.zipcode1 = this.address.zipcode;
          // this.city1 = this.address.city;
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.updatableplace = place;
          this.address.location = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          this.zoom = 12;

          setTimeout(()=>{
            this.geocode();
          },200)
                   
        });
      });
    });
  }

   // Get Current Location Coordinates
   private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        // if(this.profiledata &&this.profiledata.location){
        //   this.latitude = this.profiledata.location.lat;
        //   this.longitude = this.profiledata.location.lng;
        // }else{
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
        // }
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
          this.address.city = results[0].address_components[results[0].address_components.length - 4].long_name;
          this.address['zipcode'] = results[0].address_components[results[0].address_components.length - 1].long_name;
          
          this.zipcode1 = results[0].address_components[results[0].address_components.length - 1].long_name;;
          this.city1 = results[0].address_components[results[0].address_components.length - 4].long_name;;
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
          this.address.city = results[0].address_components[results[0].address_components.length - 4].long_name;
          this.address['zipcode'] = results[0].address_components[results[0].address_components.length - 1].long_name;
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
          this.address.formatted_address = results[0].formatted_address;
          this.address.city = results[0].address_components[results[0].address_components.length - 4].long_name;
          this.address['zipcode'] = results[0].address_components[results[0].address_components.length - 1].long_name;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

}
