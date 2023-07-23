import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { ReviewsComponent } from './reviews.component';
import { ReviewlistComponent } from './reviewlist/reviewlist.component';
import { AddreviewComponent } from './addreview/addreview.component';

const routes: Routes = [
  {
		path: '', component: ReviewsComponent,
		children: [
			{ path: '', redirectTo: 'list', pathMatch: 'full' },
			{ path: 'list', component: ReviewlistComponent },
			{ path: 'edit/:id', component: AddreviewComponent }
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewsRoutingModule { }
