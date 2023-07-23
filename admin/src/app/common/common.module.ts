import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomtableComponent } from './customtable/customtable.component';
import { Ng2SmartTableModule } from "../Common-Table/public-api";
import { LayoutContainersModule } from '../containers/layout/layout.containers.module';
import { CollapseModule, TooltipModule, RatingModule, TabsModule, AccordionModule, BsDropdownModule } from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ModalModule } from 'ngx-bootstrap';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { StarButtonComponent } from './star-button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from "./ArrayMergeFilters";
import { CheckboxComponent } from './checkbox.component';
import { VerifyiconComponent } from "./verify-icon.component";
import { CustomComponent } from './custom.component';

@NgModule({
  declarations: [
    CustomtableComponent,
    StarButtonComponent,
    CheckboxComponent,
    FilterPipe,    
    VerifyiconComponent,
    CustomComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    PerfectScrollbarModule,
    Ng2SmartTableModule,
    LayoutContainersModule,
    CollapseModule,
    RatingModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    SimpleNotificationsModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
  ],
  exports :[
    CommonModule,
    CustomtableComponent,
    StarButtonComponent,
    FilterPipe,
    CheckboxComponent,
    CustomComponent
  ]
})
export class CommonFuctionModule { }
