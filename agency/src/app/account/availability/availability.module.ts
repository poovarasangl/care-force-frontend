import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AvailabilityRoutingModule } from './availability-routing.module';
import { AvailabilityComponent } from './availability.component';
import { AgmCoreModule } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [AvailabilityComponent],
  imports: [
    CommonModule,
    AvailabilityRoutingModule,
    SharedModule,
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      apiKey: 'AIzaSyDOWLOdSlkFTFxsXYziOBm9MZVpwqHhI7w'
    }),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AvailabilityModule { }
