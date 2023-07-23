import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CancellationComponent } from './cancellation.component';
import { CancellationeditComponent } from './cancellationedit/cancellationedit.component';
import { CancellationlistComponent } from './cancellationlist/cancellationlist.component';


const routes: Routes = [
  {
    path: '', component: CancellationComponent,
    children: [
        { path: '', redirectTo: 'cancellationlist', pathMatch: 'full' },
        { path: 'cancellationlist', component: CancellationlistComponent },
        { path: 'cancellationedit/:id', component: CancellationeditComponent },
        { path: 'cancellationadd', component: CancellationeditComponent },
    ],
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CancellationRoutingModule { }
