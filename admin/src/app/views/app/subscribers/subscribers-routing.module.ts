import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubscribersComponent } from "./subscribers.component";
import { SubscriberslistComponent } from './subscriberslist/subscriberslist.component';

const routes: Routes = [
  {
		path: '', component: SubscribersComponent,
		children: [
			{ path: '', redirectTo: 'list', pathMatch: 'full' },
			{ path: 'list', component: SubscriberslistComponent }
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscribersRoutingModule { }
