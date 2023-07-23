import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { CommonFuctionModule } from 'src/app/common/common.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExpertsmanagementRoutingModule } from './expertsmanagement-routing.module';
import { ExpertsmanagementComponent } from './expertsmanagement.component';
import { ExperienceComponent } from './experience/experience.component';
import { AddexperienceComponent } from './addexperience/addexperience.component';
import { QuestionsComponent } from './questions/questions.component';
import { AddquestionComponent } from './addquestion/addquestion.component';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';


@NgModule({
  declarations: [ExpertsmanagementComponent, ExperienceComponent, AddexperienceComponent, QuestionsComponent, AddquestionComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule,
    NgSelectModule,
    SimpleNotificationsModule,
    ComponentsStateButtonModule,
    CommonFuctionModule,
    ExpertsmanagementRoutingModule,
    LayoutContainersModule,
    SharedModule
  ]
})
export class ExpertsmanagementModule { }
