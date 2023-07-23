import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskComponent } from './task.component';
import { JobDetailsComponent } from './job-details/job-details.component';
import { ViewExpertsComponent } from './view-experts/view-experts.component';

const routes: Routes = [
  {
    path:'',  component : TaskComponent,
    children: [
      {
        path:'job-details/:slug', component : JobDetailsComponent
      },
      {
        path:'view-experts/:slug', component : ViewExpertsComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
