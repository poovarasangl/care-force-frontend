import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskRoutingModule } from './task-routing.module';
import { TaskComponent } from './task.component';
import { SharedModule } from '../shared/shared.module';
import { JobDetailsComponent } from './job-details/job-details.component';
import { AgmCoreModule } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewExpertsComponent } from './view-experts/view-experts.component';
import { Ng5SliderModule } from 'ng5-slider';
import { TaskService } from './task.service';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from '../pagination/pagination.module';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { CONFIG } from '../config';

const config: SocketIoConfig = { url: `${CONFIG.imageUrl}notify`, options: {} };


@NgModule({
  declarations: [
    TaskComponent,
    JobDetailsComponent,
    ViewExpertsComponent
  ],
  imports: [
    CommonModule,
    TaskRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    AgmCoreModule.forRoot(),
    Ng5SliderModule,
    PaginationModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [TaskService],
  exports :[]
})
export class TaskModule { }
