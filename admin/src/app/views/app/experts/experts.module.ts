import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { ModalModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ModalsModule } from "../../../shared/modals/modals.module";
import { CommonFuctionModule } from "src/app/common/common.module";
import { ExpertsRoutingModule } from './experts-routing.module';
import { ExpertsComponent } from "./experts.component";
import { TaskersaddComponent } from './taskersadd/taskersadd.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { FormsContainersModule } from 'src/app/containers/forms/forms.containers.module';
import { TranslateModule } from '@ngx-translate/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AgmCoreModule } from '@agm/core';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [ExpertsComponent, TaskersaddComponent,],
  imports: [
    CommonModule,
    TranslateModule,
    FormsContainersModule,
    ComponentsStateButtonModule,
    CommonFuctionModule,
    LayoutContainersModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    ModalsModule,
    BsDatepickerModule,
    TabsModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    ExpertsRoutingModule,
    Ng2TelInputModule,
    CollapseModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCyHt1_Lmid3TUTRwo5QERrr5crmC1t6_U',
      libraries: ["places"],
    }),
    AccordionModule.forRoot(),
    NgSelectModule
  ]
})
export class ExpertsModule { }
