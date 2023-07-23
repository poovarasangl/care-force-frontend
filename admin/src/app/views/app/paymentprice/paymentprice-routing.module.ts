import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentpriceComponent } from './paymentprice.component';
import { PaymentpriceeditComponent } from './paymentedit/paymentpriceedit.component';
import { PaymentpricelistComponent } from './paymentlist/paymentpricelist.component';


const routes: Routes = [
  {
    path: '', component: PaymentpriceComponent,
    children: [
        { path: '', redirectTo: 'list', pathMatch: 'full' },
        { path: 'list', component: PaymentpricelistComponent },
        { path: 'edit/:id', component: PaymentpriceeditComponent },
        { path: 'add', component: PaymentpriceeditComponent },
    ],
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentpriceRoutingModule { }
