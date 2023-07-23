import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymenteditComponent } from './paymentedit/paymentedit.component';
import { PaymentgatewayComponent } from './paymentgateway.component';
import { PaymentlistComponent } from './paymentlist/paymentlist.component';

const routes: Routes = [
  {
    path: '', component: PaymentgatewayComponent,
    children: [
      { path: '', redirectTo: 'paymentlist', pathMatch: 'full' },
      { path: 'paymentlist', component: PaymentlistComponent },
      { path: 'paymentedit/:id', component: PaymenteditComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentgatewayRoutingModule { }
