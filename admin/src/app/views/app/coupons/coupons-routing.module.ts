import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CouponsComponent } from "./coupons.component";
import { CouponlistComponent } from './couponlist/couponlist.component';
import { AddcouponComponent } from './addcoupon/addcoupon.component';

const routes: Routes = [
  {
		path: '', component: CouponsComponent,
		children: [
			{ path: '', redirectTo: 'list', pathMatch: 'full' },
			{ path: 'list', component: CouponlistComponent },
			{ path: 'add', component: AddcouponComponent },
			{ path: 'edit/:id', component: AddcouponComponent },

		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponsRoutingModule { }
