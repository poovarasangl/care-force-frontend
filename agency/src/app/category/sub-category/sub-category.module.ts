import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubCategoryRoutingModule } from './sub-category-routing.module';
import { SubCategoryComponent } from './sub-category.component';
import { SubCategoryService } from './sub-category.service';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [SubCategoryComponent],
  imports: [
    CommonModule,
    SubCategoryRoutingModule,
    SharedModule,
  ],
  providers: [SubCategoryService],
  exports:[]
})
export class SubCategoryModule { }
