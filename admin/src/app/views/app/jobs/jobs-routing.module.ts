import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlljobsComponent } from './alljobs/alljobs.component';
import { JobsComponent } from "./jobs.component";
import { JobdetailsComponent } from "./jobdetails/jobdetails.component";


const routes: Routes = [
  {
		path: '', component: JobsComponent,
		children: [
			{ path: '', redirectTo: 'all-jobs', pathMatch: 'full' },
			{ path: 'all-jobs', component: AlljobsComponent },
			{ path: 'ongoing', component: AlljobsComponent },
			{ path: 'paymentpending', component: AlljobsComponent },
			{ path: 'completed', component: AlljobsComponent },
			{ path: 'cancelled', component: AlljobsComponent },
			{ path: 'jobdetails/:id', component: JobdetailsComponent },
			{ path: 'expired', component: AlljobsComponent },
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobsRoutingModule { }
