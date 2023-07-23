import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { ModalModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ModalsModule } from "../../../../shared/modals/modals.module";
import { CommonFuctionModule } from "src/app/common/common.module";
import { TaskersRoutingModule } from './taskers-routing.module';
import { TaskerslistComponent } from './taskerslist/taskerslist.component';
import { TaskerseditComponent } from './taskersedit/taskersedit.component';
import { TaskersComponent } from './taskers.component';
import { TranslateModule } from '@ngx-translate/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AgmCoreModule } from '@agm/core';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsContainersModule } from 'src/app/containers/forms/forms.containers.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [TaskerslistComponent, TaskerseditComponent, TaskersComponent],
  imports: [
    CommonModule,
    CommonFuctionModule,
    LayoutContainersModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    ModalsModule,
    TranslateModule,
    SimpleNotificationsModule.forRoot(),
    TaskersRoutingModule,
    Ng2TelInputModule,
    CollapseModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAPwt3Qbr8kuxWx_KGtHrWeh4E5ej0UA1g',
      libraries: ["places"],
    }),
    ComponentsStateButtonModule,
    BsDatepickerModule,
    TabsModule,
    FormsContainersModule,
    AccordionModule.forRoot(),
    NgSelectModule
  ]
})
export class TaskersModule { }
