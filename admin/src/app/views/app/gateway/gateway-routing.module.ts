import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GatewayComponent } from './gateway.component';
import { SmsgatewayComponent } from './smsgateway/smsgateway.component';

const routes: Routes = [
  {
    path: '', component: GatewayComponent,
    children: [
      { path: '', redirectTo: 'paymentgateway', pathMatch: 'full' },
      { path: 'paymentgateway', loadChildren: () => import('./paymentgateway/paymentgateway.module').then(m => m.PayementgatewayModule) },
      { path: 'smsgateway', component: SmsgatewayComponent },
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GatewayRoutingModule { }
