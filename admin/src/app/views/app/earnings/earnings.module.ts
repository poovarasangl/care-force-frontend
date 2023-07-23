import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EarningsRoutingModule } from './earnings-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { CommonFuctionModule } from 'src/app/common/common.module';
import { EarningsComponent } from "./earnings.component";
import { EarningslistComponent } from './earningslist/earningslist.component';
import { PayoutlistComponent } from './payoutlist/payoutlist.component';
import { LayoutContainersModule } from '../../../containers/layout/layout.containers.module';
import { PayouteditComponent } from './payoutedit/payoutedit.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule} from 'ngx-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [EarningsComponent, EarningslistComponent, PayoutlistComponent, PayouteditComponent],
  imports: [
    CommonModule,
    EarningsRoutingModule,
    CommonFuctionModule,
    ComponentsStateButtonModule,
    SimpleNotificationsModule,
    NgSelectModule,
    QuillModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutContainersModule,
    TabsModule,
    TooltipModule.forRoot(),
    SharedModule
  ]
})
export class EarningsModule { }
