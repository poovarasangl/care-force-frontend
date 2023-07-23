import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalsRoutingModule } from './modals-routing.module';
import { ReplymailModalComponent } from './replymail-modal/replymail-modal.component';
import { ModalModule } from 'ngx-bootstrap';


@NgModule({
  declarations: [ReplymailModalComponent],
  imports: [
    CommonModule,
    ModalsRoutingModule,
    ModalModule.forRoot(),
  ]
})
export class ModalsModule { }
