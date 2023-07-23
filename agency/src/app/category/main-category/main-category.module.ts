import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainCategoryRoutingModule } from './main-category-routing.module';
import { MainCategoryComponent } from './main-category.component';
import { MainCategoryService } from './main-category.service';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [MainCategoryComponent],
  imports: [
    CommonModule,
    MainCategoryRoutingModule,
    SharedModule,
  ],
  providers: [MainCategoryService]
})
export class MainCategoryModule { }
