import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { ModalModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ModalsModule } from "../../../../shared/modals/modals.module";
import { CommonFuctionModule } from "src/app/common/common.module";
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { DocumentsComponent } from "./documents.component";
import { DocumentsRoutingModule } from './documents-routing.module';
import { DocumentlistComponent } from './documentlist/documentlist.component';
import { DocumenteditComponent } from './documentedit/documentedit.component';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [DocumentlistComponent, DocumenteditComponent, DocumentsComponent],
  imports: [
    CommonModule,
    CommonFuctionModule,
    LayoutContainersModule,
    ComponentsStateButtonModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    ModalsModule,
    SimpleNotificationsModule.forRoot(),   
    DocumentsRoutingModule,
    NgSelectModule
  ]
})
export class DocumentsModule { }
