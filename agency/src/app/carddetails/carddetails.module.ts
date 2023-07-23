import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarddetailsRoutingModule } from './carddetails-routing.module';
import { CarddetailsComponent } from './carddetails.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CarddetailsComponent],
  imports: [
    CommonModule,
    CarddetailsRoutingModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule,
  ]
})
export class CarddetailsModule { }
