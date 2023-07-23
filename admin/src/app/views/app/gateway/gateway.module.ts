import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GatewayComponent } from "./gateway.component";
import { GatewayRoutingModule } from './gateway-routing.module';
import { PaymentgatewayComponent } from './paymentgateway/paymentgateway.component';
import { SmsgatewayComponent } from './smsgateway/smsgateway.component';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { ModalModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ModalsModule } from "../../../shared/modals/modals.module";
import { CommonFuctionModule } from "src/app/common/common.module";
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [GatewayComponent,PaymentgatewayComponent, SmsgatewayComponent,],
  imports: [
    CommonModule,
    GatewayRoutingModule,
    CommonFuctionModule,
    LayoutContainersModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    ModalsModule,
    ComponentsStateButtonModule,
    SimpleNotificationsModule.forRoot(),
    NgSelectModule,
    SharedModule
  ]
})
export class GatewayModule { }
