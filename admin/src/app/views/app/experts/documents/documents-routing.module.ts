import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumenteditComponent } from './documentedit/documentedit.component';
import { DocumentlistComponent } from './documentlist/documentlist.component';
import { DocumentsComponent } from './documents.component';


const routes: Routes = [
  {
    path: '', component: DocumentsComponent,
    children: [
        { path: '', redirectTo: 'documentlist', pathMatch: 'full' },
        { path: 'documentlist', component: DocumentlistComponent },
        { path: 'documentedit/:id', component: DocumenteditComponent },
        { path: 'documentadd', component: DocumenteditComponent },
    ],
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentsRoutingModule { }
