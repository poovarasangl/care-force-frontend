import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { StoreService } from '../../store/store.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskComponent } from '../task.component';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.sass']
})
export class JobDetailsComponent implements OnInit {
  @ViewChild('search') searchElementRef: ElementRef;

  // google maps zoom level
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  discription: String;
  jobdeatails:any;
  submit :boolean = false;

  constructor(private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private store: StoreService,
    private router: Router,
    private route: ActivatedRoute,
    private taskmainpage : TaskComponent ) { }

  ngOnInit() {            
    this.jobdeatails = JSON.parse(localStorage.getItem('jobdetailsdata'));  
    if(this.jobdeatails){
      this.address = this.jobdeatails[0].task_address;
      this.discription = this.jobdeatails[0].task_description;
      this.latitude = this.jobdeatails[0].location.lat;
      this.longitude = this.jobdeatails[0].location.long;
    }
    this.mapsAPILoader.load().then(() => {
     // this.setCurrentLocation();
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
  }
  // Get Current Location Coordinates
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


  markerDragEnd($event: MouseEvent) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
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

  see_experts() {
    this.submit = true;
    if (this.address && this.discription) {
      let data =[{ task_address: this.address, task_description: this.discription,location :{lat : this.latitude,long:this.longitude}}];
      localStorage.setItem('seletedtabtask','veiw-experts');
      localStorage.setItem('jobdetailsdata',JSON.stringify(data));
      this.taskmainpage.ngOnInit();
    }
  }
}
