import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EarningsComponent } from "./earnings.component";
import { EarningslistComponent } from './earningslist/earningslist.component';
import { PayoutlistComponent } from './payoutlist/payoutlist.component';
import { PayouteditComponent } from './payoutedit/payoutedit.component';

const routes: Routes = [
  {
		path: '', component: EarningsComponent,
		children: [
			{ path: '', redirectTo: 'earninglist', pathMatch: 'full' },
			{ path: 'earninglist', component: EarningslistComponent },
			{ path: 'payoutlist', component: PayoutlistComponent },
			{ path: 'viewearnings/:id', component: PayouteditComponent },
			{ path: 'viewearnings/:id/:id2', component: PayouteditComponent },
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EarningsRoutingModule { }
