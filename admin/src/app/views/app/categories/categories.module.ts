import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from "./categories.component";
import { CategoriesRoutingModule } from './categories-routing.module';
import { MaincategorieslistComponent } from './maincategorieslist/maincategorieslist.component';
import { MaincategorieseditComponent } from './maincategoriesedit/maincategoriesedit.component';
import { SubcategorieslistComponent } from './subcategorieslist/subcategorieslist.component';
import { SubcategorieseditComponent } from './subcategoriesedit/subcategoriesedit.component';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { ModalModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ModalsModule } from "../../../shared/modals/modals.module";
import { CommonFuctionModule } from "src/app/common/common.module";
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';




@NgModule({
  declarations: [CategoriesComponent, MaincategorieslistComponent, MaincategorieseditComponent, SubcategorieslistComponent, SubcategorieseditComponent],
  imports: [
    CommonModule,
    ComponentsStateButtonModule,
    CategoriesRoutingModule,
    CommonFuctionModule,
    LayoutContainersModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    ModalsModule,
    SimpleNotificationsModule.forRoot(),
    SharedModule,
    NgSelectModule
  ]
})
export class CategoriesModule { }
