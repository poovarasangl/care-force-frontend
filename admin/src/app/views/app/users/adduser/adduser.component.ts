import { Component, OnInit, ViewChild, TemplateRef, ElementRef, NgZone } from '@angular/core';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Apiconfig, AdminService, AuthenticationService } from "../../../../_services";
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from "src/environments/environment";
import { MapsAPILoader, Marker, MouseEvent } from '@agm/core';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss']
})

export class AdduserComponent implements OnInit {

  @ViewChild('form') form: NgForm;
  @ViewChild('mobilenumber') mobilenumber: ElementRef;
  @ViewChild('search') searchElementRef: ElementRef;
  buttonDisabled = false;
  buttonState = '';
  imageUrl: string = environment.apiUrl;
  imagepreview = {
    image: '' as string | ArrayBuffer
  }
  spinner = 'none';
  curentUser: any;
  userPrivilegeDetails: any;
  access : boolean = true;
  address:any = {};
  private geoCoder;
  updatableplace: google.maps.places.PlaceResult;
  latitude: any;
  longitude: any

  constructor(
    private AdminService: AdminService,
    private notifications: NotificationsService,
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
  ) {
    this.curentUser = this.authService.currentUserValue;
    if (this.curentUser && this.curentUser.user_details && this.curentUser.user_details.role == "subadmin") {
      if (this.ActivatedRoute.snapshot.routeConfig.component.name == 'AdduserComponent') {
        let data = this.curentUser.user_details.privileges.filter(x => x.alias == 'agency');
        this.userPrivilegeDetails = data.length > 0 ? data[0].status : {};
      }
    }
  }

  title = "";
  Referral_Code = "";
  avatar = "";
  countrycode = '';
  phonenumber = "";
  profile_pic: string | ArrayBuffer = null;
  ngOnInit() {
    this.loadmap();
    const id = this.ActivatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.showspinner();
      this.title = "Edit";
      this.AdminService.CommonApi('post', Apiconfig.getUserdata, { id: id }).subscribe(
        (result) => {
          if (result.status == 1) {
            this.hidespinner();
            this.Referral_Code = result.response.unique_code;
            this.avatar = result.response.avatar;
            this.countrycode = result.response.phone.code;
            this.phonenumber = result.response.phone.code + result.response.phone.number;
            this.address = result.response.address;
            this.form.form.controls['user_id'].setValue(result.response._id);
            this.form.form.controls['firstname'].setValue(result.response.firstname);
            this.form.form.controls['lastname'].setValue(result.response.lastname);
            this.form.form.controls['email'].setValue(result.response.email);
            this.form.form.controls['phone'].setValue(result.response.phone.number);
            this.form.form.controls['userimg'].setValue(result.response.avatar);
            this.form.form.controls['status'].setValue(result.response.status + '');
          }
        }, (error) => {
          this.hidespinner();
          this.buttonDisabled = false;
          this.buttonState = '';
          this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
        })
    } else {
      this.hidespinner();
      this.title = "Add New";
      this.countrycode = "+91";
    }
  }

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

  convertfile(event) {
    let avatarBase64 = this;
    let file = event.target.files[0];
    this.preview(file, 'image');
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      avatarBase64.profile_pic = reader.result;
    };

    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
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

  loadmap() {
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
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.updatableplace = place;
                   
        });
      });
    });
    
  }

  onSubmit() {
    if (this.userPrivilegeDetails && this.userPrivilegeDetails.add != true && !this.ActivatedRoute.snapshot.paramMap.get('id')) {
      this.access = false;
      this.notifications.create('Warning', "Can't access the page.", NotificationType.Warn, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
    }else if(this.userPrivilegeDetails && this.userPrivilegeDetails.edit != true && this.ActivatedRoute.snapshot.paramMap.get('id')){
      this.access = false;
      this.notifications.create('Warning', "Can't access the page.", NotificationType.Warn, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
    } else {
      this.showspinner();
      this.buttonDisabled = true;
      this.buttonState = 'show-spinner';

      if (this.form.form.valid) {
        if(this.form.form.get('password').value != this.form.form.get('confirmpassword').value){
          
          this.hidespinner();
          this.buttonDisabled = false;
          this.buttonState = '';
          this.notifications.create('Error', `Confirm Passwod does't not match.`, NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
          return false;
        }
        var data = {
          '_id': this.form.form.get('user_id').value,
          'companyname': this.form.form.get('companyname').value,
          //'lastname': this.form.form.get('lastname').value,
          'email': this.form.form.get('email').value,
          'avatar': this.form.form.get('userimg').value,
          'role': 'user',
          'status': this.form.form.get('status').value,
          'password': this.form.form.get('password').value,
          'unique_code': this.Referral_Code,
          'address': this.address,
          'lng': this.longitude,
          'lat': this.latitude
        };
        if (this.profile_pic != null) {
          data['avatarBase64'] = this.profile_pic.toString();
        }

        data['phone'] = {
          'code': this.countrycode,
          'number': this.form.form.get('phone').value
        }

        this.AdminService.CommonApi('post', Apiconfig.Usersubmit, data).subscribe(
          (data) => {
            this.buttonDisabled = false;
            this.buttonState = 'show-spinner';
            if (data) {
              if (data.status == 1) {
                this.hidespinner();
                this.buttonDisabled = false;
                this.buttonState = '';
                this.notifications.create('Success', data.response, NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });

                setTimeout(() => {
                  this.router.navigate(['/app/agency/list']);
                }, 1000);
              } else {
                this.hidespinner();
                this.buttonDisabled = false;
                this.buttonState = '';
                this.notifications.create('Error', data.response, NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
              }
            }
          }, (error) => {
            this.hidespinner();
            this.buttonDisabled = false;
            this.buttonState = '';
            this.notifications.create('Error', error.message, NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
          })
      }
      else {
        this.hidespinner();
        this.buttonDisabled = false;
        this.buttonState = '';
        this.notifications.create('Error', 'Please Enter all mandatory fields', NotificationType.Error, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
      }
    }
  }
  showspinner() {
    this.spinner = 'block'
  }
  hidespinner() {
    this.spinner = 'none';
  }
}
