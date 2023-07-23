import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentpriceComponent } from "./paymentprice.component";
import { PaymentpriceRoutingModule } from './paymentprice-routing.module';
import { PaymentpricelistComponent } from './paymentlist/paymentpricelist.component';
import { PaymentpriceeditComponent } from './paymentedit/paymentpriceedit.component';
import { CommonFuctionModule } from "src/app/common/common.module";
import { LayoutContainersModule } from "../../../containers/layout/layout.containers.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [PaymentpricelistComponent, PaymentpriceeditComponent, PaymentpriceComponent],
  imports: [
    CommonModule,
    PaymentpriceRoutingModule,
    CommonFuctionModule,
    LayoutContainersModule,
    FormsModule, ReactiveFormsModule,
    ComponentsStateButtonModule,
    SimpleNotificationsModule,
    NgSelectModule,
    SharedModule
  ]
})
export class PaymentpriceModule { }
