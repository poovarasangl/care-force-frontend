import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainadminlistComponent } from "./mainadminlist/mainadminlist.component";
import { MainadmineditComponent } from "./mainadminedit/mainadminedit.component";
import { SubadminlistComponent } from "./subadminlist/subadminlist.component";
import { SubadmineditComponent } from "./subadminedit/subadminedit.component";
import { AdministratorComponent } from './administrator.component';

const routes: Routes = [
  {
    path: '', component: AdministratorComponent,
    children: [
      { path: '', redirectTo: 'mainadminlist', pathMatch: 'full' },
      { path: 'mainadminlist', component: MainadminlistComponent },
      { path: 'mainadminedit/:id', component: MainadmineditComponent },
      { path: 'subadminlist', component: SubadminlistComponent },
      { path: 'subadminedit/:id', component: SubadmineditComponent },
      { path: 'subadminadd', component: SubadmineditComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministratorRoutingModule { }
