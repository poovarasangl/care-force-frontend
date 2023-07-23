import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { LayoutContainersModule } from "../../../containers/layout/layout.containers.module";
import { CommonFuctionModule } from 'src/app/common/common.module';
import { SubscribersComponent } from "./subscribers.component";
import { SubscribersRoutingModule } from './subscribers-routing.module';
import { SubscriberslistComponent } from './subscriberslist/subscriberslist.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [SubscribersComponent, SubscriberslistComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule,
    NgSelectModule,
    SimpleNotificationsModule,
    ComponentsStateButtonModule,
    CommonFuctionModule,
    SubscribersRoutingModule,
    SharedModule
  ]
})
export class SubscribersModule { }
