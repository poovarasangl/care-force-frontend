import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';

import { ProgressbarRoutingModule } from './progressbar-routing.module';
import { ProgressComponent } from './progress/progress.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [ProgressComponent],
  imports: [
    CommonModule,
    ProgressbarRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot(),
    ToastrModule.forRoot(),
    ModalModule.forRoot()
  ]
})
export class ProgressbarModule { }
