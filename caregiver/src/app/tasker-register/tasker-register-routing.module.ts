import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskerRegisterComponent } from './tasker-register.component';

const routes: Routes = [{path: '', component: TaskerRegisterComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskerRegisterRoutingModule { }
