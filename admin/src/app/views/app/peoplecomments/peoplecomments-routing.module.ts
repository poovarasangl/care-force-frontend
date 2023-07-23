import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PeoplecmdeditComponent } from './peoplecmdedit/peoplecmdedit.component';
import { PeoplecmdlistComponent } from './peoplecmdlist/peoplecmdlist.component';
import { PeoplecommentsComponent } from './peoplecomments.component';


const routes: Routes = [
  {
    path: '', component: PeoplecommentsComponent,
    children: [
        { path: '', redirectTo: 'list', pathMatch: 'full' },
        { path: 'list', component: PeoplecmdlistComponent },
        { path: 'edit/:id', component: PeoplecmdeditComponent },
        { path: 'add', component: PeoplecmdeditComponent },
    ],
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeoplecommentsRoutingModule { }
