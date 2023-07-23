import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { AdministratorComponent } from "./administrator.component";
import { AdministratorRoutingModule } from './administrator-routing.module';
import { MainadminlistComponent } from './mainadminlist/mainadminlist.component';
import { SubadminlistComponent } from './subadminlist/subadminlist.component';
import { MainadmineditComponent } from './mainadminedit/mainadminedit.component';
import { SubadmineditComponent } from './subadminedit/subadminedit.component';
import { CommonFuctionModule } from "src/app/common/common.module";
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AdministratorComponent,MainadminlistComponent, SubadminlistComponent, MainadmineditComponent, SubadmineditComponent],
  imports: [
    CommonModule,
    AdministratorRoutingModule,
    CommonFuctionModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule,
    NgSelectModule,
    SimpleNotificationsModule,
    ComponentsStateButtonModule,
    LayoutContainersModule,
    SharedModule
  ]
})
export class AdministratorModule { }
