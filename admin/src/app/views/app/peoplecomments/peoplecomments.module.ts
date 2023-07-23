import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeoplecommentsComponent } from "./peoplecomments.component";
import { PeoplecommentsRoutingModule } from './peoplecomments-routing.module';
import { PeoplecmdeditComponent } from './peoplecmdedit/peoplecmdedit.component';
import { PeoplecmdlistComponent } from './peoplecmdlist/peoplecmdlist.component';
import { LayoutContainersModule } from "../../../containers/layout/layout.containers.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonFuctionModule } from "src/app/common/common.module";
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [PeoplecmdeditComponent, PeoplecmdlistComponent, PeoplecommentsComponent],
  imports: [
    CommonModule,
    PeoplecommentsRoutingModule,
    CommonFuctionModule,
    LayoutContainersModule,
    FormsModule, ReactiveFormsModule,
    ComponentsStateButtonModule,
    SimpleNotificationsModule,
    NgSelectModule,
    SharedModule
  ]
})
export class PeoplecommentsModule { }
