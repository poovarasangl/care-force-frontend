import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarddetailsComponent } from './carddetails.component';

const routes: Routes = [{path:'',component : CarddetailsComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarddetailsRoutingModule { }
