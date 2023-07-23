import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewProfileRoutingModule } from './view-profile-routing.module';
import { ViewProfileComponent } from './view-profile.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RatingModule } from 'ngx-bootstrap/rating';
import { HomeService } from '../home/home.service';

@NgModule({
  declarations: [ViewProfileComponent],
  imports: [
    CommonModule,
    ViewProfileRoutingModule,
    SharedModule,
    FormsModule, ReactiveFormsModule,
    RatingModule,
  ],
  providers: [HomeService]
})
export class ViewProfileModule { }
