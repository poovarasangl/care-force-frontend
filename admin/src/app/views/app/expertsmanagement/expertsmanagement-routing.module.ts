import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpertsmanagementComponent } from './expertsmanagement.component';
import { ExperienceComponent } from './experience/experience.component';
import { AddexperienceComponent } from './addexperience/addexperience.component';
import { QuestionsComponent } from './questions/questions.component';
import { AddquestionComponent } from './addquestion/addquestion.component';

const routes: Routes = [
  {
		path: '', component: ExpertsmanagementComponent,
		children: [
      { path: '', redirectTo: 'experience/list', pathMatch: 'full' },
      { path: 'experiencelist', component: ExperienceComponent },
      { path: 'experience/edit/:id', component: AddexperienceComponent },
      { path: 'experience/add', component: AddexperienceComponent },
      { path: 'questionslist', component: QuestionsComponent },
      { path: 'question/edit/:id', component: AddquestionComponent },
      { path: 'question/add', component: AddquestionComponent },
		]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpertsmanagementRoutingModule { }
