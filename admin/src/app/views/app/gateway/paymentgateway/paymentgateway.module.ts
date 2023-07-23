import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { ModalModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ModalsModule } from "../../../../shared/modals/modals.module";
import { CommonFuctionModule } from "src/app/common/common.module";
import { PaymentlistComponent } from "./paymentlist/paymentlist.component";
import { PaymenteditComponent } from "./paymentedit/paymentedit.component";
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { PaymentgatewayRoutingModule } from "./paymentgateway-routing.module";
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [PaymentlistComponent, PaymenteditComponent],
  imports: [
    CommonModule,
    PaymentgatewayRoutingModule,
    CommonFuctionModule,
    LayoutContainersModule,
    ComponentsStateButtonModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    ModalsModule,
    SimpleNotificationsModule.forRoot(),
    NgSelectModule,
    SharedModule
  ]
})
export class PayementgatewayModule { }