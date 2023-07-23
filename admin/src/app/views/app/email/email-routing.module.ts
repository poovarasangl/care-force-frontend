import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddComponent } from './add/add.component';
import { EmailComponent } from './email.component';
import { ListComponent } from './list/list.component';


const routes: Routes = [
  {
		path: '', component: EmailComponent,
		children: [
			{ path: 'add', component: AddComponent },
			{ path: 'list', component: ListComponent },
			{ path: 'edit/:id', component: AddComponent }
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailRoutingModule { }
