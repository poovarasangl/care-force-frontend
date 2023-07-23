import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailRoutingModule } from './email-routing.module';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { EmailComponent } from "./email.component";
import { CommonFuctionModule } from 'src/app/common/common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditorModule } from '@tinymce/tinymce-angular';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AddComponent, ListComponent, EmailComponent],
  imports: [
    CommonModule,
    EmailRoutingModule,
    CommonFuctionModule,
    LayoutContainersModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsStateButtonModule,
    NgSelectModule,
    SimpleNotificationsModule.forRoot(),
    EditorModule,
    SharedModule
  ]
})
export class EmailModule { }
