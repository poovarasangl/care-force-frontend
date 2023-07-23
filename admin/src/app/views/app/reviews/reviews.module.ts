import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { CommonFuctionModule } from 'src/app/common/common.module';
import { ReviewsRoutingModule } from './reviews-routing.module';
import { ReviewsComponent } from './reviews.component';
import { ReviewlistComponent } from './reviewlist/reviewlist.component';
import { AddreviewComponent } from './addreview/addreview.component';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ReviewsComponent, ReviewlistComponent, AddreviewComponent],
  imports: [
    CommonModule,
    ReviewsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule,
    NgSelectModule,
    SimpleNotificationsModule,
    ComponentsStateButtonModule,
    CommonFuctionModule,
    LayoutContainersModule,
    SharedModule
  ]
})
export class ReviewsModule { }
