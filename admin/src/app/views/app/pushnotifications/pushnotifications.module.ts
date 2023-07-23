import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PushnotificationsRoutingModule } from './pushnotifications-routing.module';
import { UserComponent } from './user/user.component';
import { ExpertsComponent } from './experts/experts.component';
import { TemplatesComponent } from './templates/templates.component';
import { CommonFuctionModule } from "src/app/common/common.module";
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { LayoutContainersModule } from "../../../containers/layout/layout.containers.module";
import { PushnotificationsComponent } from "./pushnotifications.component";
import { EditorModule } from "@tinymce/tinymce-angular";
import { AddnotificationComponent } from "./addnotification/addnotification.component";
import { SimpleNotificationsModule } from 'angular2-notifications';
import { SharedModule } from 'src/app/shared/shared.module';





@NgModule({
  declarations: [UserComponent, ExpertsComponent, TemplatesComponent, PushnotificationsComponent, AddnotificationComponent],
  imports: [
    CommonModule,
    PushnotificationsRoutingModule,
    CommonFuctionModule,
    ComponentsStateButtonModule,
    LayoutContainersModule,
    EditorModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    SimpleNotificationsModule,
    SharedModule
  ]
})
export class PushnotificationsModule { }
