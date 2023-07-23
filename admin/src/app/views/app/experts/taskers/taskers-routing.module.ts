import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskersComponent } from './taskers.component';
import { TaskerseditComponent } from './taskersedit/taskersedit.component';
import { TaskerslistComponent } from './taskerslist/taskerslist.component';


const routes: Routes = [
  {
    path: '', component: TaskersComponent,
    children: [
        { path: '', redirectTo: 'taskerlist', pathMatch: 'full' },
        { path: 'taskerlist', component: TaskerslistComponent },
        { path: 'taskeredit/:id', component: TaskerseditComponent },
    ],
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskersRoutingModule { }
