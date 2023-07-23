import { Component } from '@angular/core';
import { AlertService } from './alert/alert.service';
import { StoreService } from './store/store.service';
import { SocketService } from "./socket.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  routerurl: string;
  currentuser: any;
  constructor(
    private store: StoreService,
    private toastr: AlertService,
    private socket : SocketService
  ) {
    this.currentuser = JSON.parse(localStorage.getItem('currentuser'));
    // this.socket.websocketConnect();
    }

  ngOnInit() {
    this.store.Url.subscribe((result: string) => {
      this.routerurl = result;
    });

    this.store.Userdetails.subscribe((data: any) => {
      if (data && data.user_id) {
        this.socket.emit('create room', { user: data.user_id });
      }else if(this.currentuser){
        this.socket.emit('create room', { user: this.currentuser.user_id });
      }
    })

    this.socket.listen('connect').subscribe(() => {
      if(this.currentuser){
        this.socket.emit('create room', { user: this.currentuser.user_id });
      }
    })
    this.socket.listen('roomcreated').subscribe((data) => {
      // this.socket.emit('message count', this.currentUser);
    });

    this.store.SocketListen.subscribe((data:any)=>{      
			if(typeof data != 'undefined' && data !=''){
        if(data.type == 'webupdatechat'){
          if (data.data.messages[0].from != this.currentuser.user_id) {
						this.infomsg('You Have Received A New Message');				
					}
				}
			}
    })
    this.store.landingdata.subscribe((landingdata:any)=>{
      if(landingdata && landingdata.settings){        
        // this.loadScript(`https://maps.googleapis.com/maps/api/js?v=3&sensor=true&amp;libraries=places&key=${landingdata.settings.googleMapAPI}`).then(() => {
        //   console.log('Success')
        // })
      }     
    })
  };
  
  loadScript(name: string) {
    return new Promise<void>((resolve, reject) => {
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = name;
      document.getElementsByTagName('body')[0].appendChild(script);
      console.log('Script Loaded');
      resolve()
    });
  }

  renderMap(googleMapAPI) {    
    if(!window.document.getElementById('google-map-script')) {
      var s = window.document.createElement("script");
      // s.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapAPI};callback=initMap`;
    //  s.src=`https://maps.googleapis.com/maps/api/js?v=3&sensor=true&amp;libraries=places&key=${googleMapAPI}`;
    // s.src=`http://maps.googleapis.com/maps/api/js?libraries=geometry&sensor=false&key=${googleMapAPI}&callback=initMap`;
    s.src = 'https://maps.googleapis.com/maps/api/js?v=3&sensor=true&amp;libraries=places&key=AIzaSyAfw6TcWoXm8FEMH1uWiPGD4o-jwXAMgBI';
      window.document.body.appendChild(s);
    }
  }

  infomsg(msg) {
		setTimeout(() => {
			this.toastr.clear();
		}, 2000);
		this.toastr.info(msg);
	}
}
