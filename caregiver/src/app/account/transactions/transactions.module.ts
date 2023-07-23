import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions.component';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { ModalModule } from '../../modal/modal.module';
import { PaginationModule } from '../../pagination/pagination.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [TransactionsComponent],
  imports: [
    CommonModule,
    TransactionsRoutingModule,
    ModalModule,
    PaginationModule,
    SharedModule
  ]
})
export class TransactionsModule { }
