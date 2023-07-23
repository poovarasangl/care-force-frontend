import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewsComponent } from './reviews.component';
import { ReviewsRoutingModule } from './reviews-routing.module';
import { ModalModule } from '../../modal/modal.module';
import { SharedModule } from '../../shared/shared.module';
import { PaginationModule } from "../../pagination/pagination.module";

@NgModule({
  declarations: [ReviewsComponent],
  imports: [
    CommonModule,
    ReviewsRoutingModule,
    ModalModule,
    SharedModule,
    PaginationModule
  ]
})
export class ReviewsModule { }
