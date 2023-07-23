import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobsRoutingModule } from './jobs-routing.module';
import { AlljobsComponent } from './alljobs/alljobs.component';
import { JobsComponent } from "./jobs.component";
import { CommonFuctionModule } from 'src/app/common/common.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { JobdetailsComponent } from "./jobdetails/jobdetails.component";
import { SimpleNotificationsModule } from 'angular2-notifications';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AlljobsComponent, JobsComponent, JobdetailsComponent],
  imports: [
    CommonModule,
    JobsRoutingModule,
    CommonFuctionModule,
    LayoutContainersModule,
    TabsModule,
    SimpleNotificationsModule,
    SharedModule
  ]
})
export class JobsModule { }
