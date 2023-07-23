import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { ConfirmDialogService } from "../confirm-dialog/confirm-dialog.service";
import { SharedModule } from "../shared/shared.module";


@NgModule({
  declarations: [ConfirmDialogComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports :[
    ConfirmDialogComponent
  ],
  providers: [ConfirmDialogService]
})
export class ConfirmDialogModule { }
