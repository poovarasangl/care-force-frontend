import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AgmCoreModule } from '@agm/core';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      apiKey: 'AIzaSyDOWLOdSlkFTFxsXYziOBm9MZVpwqHhI7w'
    }),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TabsModule.forRoot(),
    ToastrModule.forRoot(),
    Ng2TelInputModule
  ]
})
export class RegisterModule { }
