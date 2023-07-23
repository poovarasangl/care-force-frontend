import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CouponsRoutingModule } from './coupons-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { CouponsComponent } from "./coupons.component";
import { CouponlistComponent } from './couponlist/couponlist.component';
import { AddcouponComponent } from './addcoupon/addcoupon.component';
import { CommonFuctionModule } from 'src/app/common/common.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [CouponsComponent, CouponlistComponent, AddcouponComponent],
  imports: [
    CommonModule,
    CouponsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule,
    NgSelectModule,
    SimpleNotificationsModule,
    ComponentsStateButtonModule,
    CommonFuctionModule,
    LayoutContainersModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
  ]
})
export class CouponsModule { }
