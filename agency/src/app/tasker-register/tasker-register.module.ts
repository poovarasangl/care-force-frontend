import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskerRegisterRoutingModule } from './tasker-register-routing.module';
import { TaskerRegisterComponent } from './tasker-register.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from '../datepicker/date-picker-directive.module';
import { AgmCoreModule } from '@agm/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ConfirmDialogModule } from "../confirm-dialog/confirm-dialog.module";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [TaskerRegisterComponent],
  imports: [
    CommonModule,
    TaskerRegisterRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DatePickerModule,
    ConfirmDialogModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      apiKey: 'AIzaSyDOWLOdSlkFTFxsXYziOBm9MZVpwqHhI7w'
    }),
  ]
})
export class TaskerRegisterModule { }
