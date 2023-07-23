import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from '../../modal/modal.module';
import { SharedModule } from '../../shared/shared.module';
@NgModule({
  declarations: [CategoryComponent],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    ModalModule,
    FormsModule, 
    ReactiveFormsModule,
    SharedModule
  ]
})
export class CategoryModule { }
