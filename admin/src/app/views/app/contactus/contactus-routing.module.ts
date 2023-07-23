import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactlistComponent } from './contactlist/contactlist.component';
import { ContacteditComponent } from './contactedit/contactedit.component';
import { ContactusComponent } from './contactus.component';


const routes: Routes = [
  {
    path: '', component: ContactusComponent,
    children: [
      { path: '', redirectTo: 'contact-us', pathMatch: 'full' },
      { path: 'contact-us', component: ContactlistComponent },
      { path: 'contact-edit/:id', component: ContacteditComponent },
      { path: 'contact-add', component: ContacteditComponent } 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactusRoutingModule { }
