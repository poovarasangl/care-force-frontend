import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { CurrencylistComponent } from "./currencylist/currencylist.component";
import { CurrencyeditComponent } from "./currencyedit/currencyedit.component";
import { CurrenciesRoutingModule } from "./currencies.routing";
import { CommonFuctionModule } from "src/app/common/common.module";
import { NgSelectModule } from '@ng-select/ng-select';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CurrencylistComponent, CurrencyeditComponent ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonFuctionModule,
    CurrenciesRoutingModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule,
    NgSelectModule,
    LayoutContainersModule,
    SharedModule
  ]
})
export class CurrenciesModule { }