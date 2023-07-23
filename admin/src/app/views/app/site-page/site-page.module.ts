import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { SitePageRoutingModule } from "./site-page.routing";
import { SitePageComponent } from "./site-page.component";
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { AllpagesComponent } from './allpages/allpages.component';
import { AddpageComponent } from './addpage/addpage.component';
import { AddtranslatepageComponent } from './addtranslatepage/addtranslatepage.component';
import { LanguageslistComponent } from './languageslist/languageslist.component';
import { CommonFuctionModule } from 'src/app/common/common.module';
import { EditorModule } from "@tinymce/tinymce-angular";
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    SitePageComponent, 
    AllpagesComponent, 
    AddpageComponent, 
    AddtranslatepageComponent, LanguageslistComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SitePageRoutingModule,
    NgSelectModule,
    QuillModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule,
    CommonFuctionModule,
    EditorModule,
    LayoutContainersModule,
    SharedModule
  ]
})
export class SitePageModule { }
