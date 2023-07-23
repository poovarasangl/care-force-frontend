import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExpertsComponent } from './experts.component';
import { TaskersaddComponent } from './taskersadd/taskersadd.component';


const routes: Routes = [
  {
    path: '', component: ExpertsComponent,
    children: [
        { path: '', redirectTo: 'taskers', pathMatch: 'full' },
        { path: 'taskers', loadChildren: () => import('./taskers/taskers.module').then(m => m.TaskersModule) },
        { path: 'addnewtasker', component: TaskersaddComponent },
        { path: 'document', loadChildren: () => import('./documents/documents.module').then(m => m.DocumentsModule) },
    ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpertsRoutingModule { }
