import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { ExpertsComponent } from './experts/experts.component';
import { TemplatesComponent } from "./templates/templates.component";
import { PushnotificationsComponent } from "./pushnotifications.component";
import { AddnotificationComponent } from "./addnotification/addnotification.component";

const routes: Routes = [
  { path: '', component: PushnotificationsComponent, children: [
    { path: '', redirectTo: 'users', pathMatch: 'full'},
    { path: 'users', component: UserComponent},
    { path: 'experts', component: ExpertsComponent },
    { path: 'templates', component: TemplatesComponent },
    { path: 'addnotification', component: AddnotificationComponent},
    { path: 'editnotification/:id', component: AddnotificationComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PushnotificationsRoutingModule { }
