import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactusRoutingModule } from './contactus-routing.module';
import { ContactusComponent } from './contactus.component';
import { ContactlistComponent } from './contactlist/contactlist.component';
import { ContacteditComponent } from './contactedit/contactedit.component';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { ModalModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ModalsModule } from "../../../shared/modals/modals.module";
import { CommonFuctionModule } from "src/app/common/common.module";
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ContactusComponent, ContactlistComponent, ContacteditComponent],
  imports: [
    CommonModule,
    ContactusRoutingModule,
    CommonFuctionModule,
    LayoutContainersModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    ModalsModule,
    SimpleNotificationsModule.forRoot(),
    SharedModule
  ]
})
export class ContactusModule { }
