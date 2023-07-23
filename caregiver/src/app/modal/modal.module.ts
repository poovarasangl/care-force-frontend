import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal.component';
import { ModalService } from './modal.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { RatingModule } from 'ngx-bootstrap/rating';

@NgModule({
  declarations: [ModalComponent],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    SharedModule,
    RatingModule
  ],
  exports:[ModalComponent],
  providers:[ModalService]
})
export class ModalModule { }
 