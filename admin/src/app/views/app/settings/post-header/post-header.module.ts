import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { PostheadereditComponent } from "./postheaderedit/postheaderedit.component";
import { PostheaderlistComponent } from "./postheaderlist/postheaderlist.component";
import { PostHeaderRoutingModule } from './post-header-routing.module';
import { CommonFuctionModule } from "src/app/common/common.module";
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [PostheaderlistComponent, PostheadereditComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonFuctionModule,
    PostHeaderRoutingModule,
    LayoutContainersModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule,
    NgSelectModule,
    SharedModule
  ]
})
export class PostHeaderModule { }
