import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesRoutingModule } from './messages-routing.module';
import { MessagesComponent } from './messages.component';
import { SharedModule } from '../shared/shared.module';
import { PaginationModule } from '../pagination/pagination.module';
import { ConfirmDialogModule } from '../confirm-dialog/confirm-dialog.module';
@NgModule({
  declarations: [MessagesComponent],
  imports: [
    CommonModule,
    MessagesRoutingModule,
    SharedModule,
    PaginationModule,
    ConfirmDialogModule
  ]
})
export class MessagesModule { }
