import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobDetailsRoutingModule } from './job-details-routing.module';
import { JobDetailsComponent } from './job-details.component';
import { DatePickerModule } from '../../datepicker/date-picker-directive.module';
// import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationModule } from '../../pagination/pagination.module';
import { SharedModule } from '../../shared/shared.module';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { CONFIG } from '../../config';

const config: SocketIoConfig = { url: `${CONFIG.imageUrl}notify`, options: {} };

 import { ModalModule } from '../../modal/modal.module';
@NgModule({
  declarations: [JobDetailsComponent],
  imports: [
    CommonModule,
    JobDetailsRoutingModule,
    DatePickerModule,
    ModalModule,
    FormsModule, 
    ReactiveFormsModule,
    PaginationModule,
    SharedModule,
    SocketIoModule.forRoot(config),
  ]
})
export class JobDetailsModule { }
