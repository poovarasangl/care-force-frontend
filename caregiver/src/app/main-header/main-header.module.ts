import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainHeaderComponent } from './main-header.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmDialogModule } from '../confirm-dialog/confirm-dialog.module';
import { SharedModule } from '../shared/shared.module';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { CONFIG } from '../config';
const config: SocketIoConfig = { url: `${CONFIG.imageUrl}notify`, options: {} };

@NgModule({
  declarations: [
    MainHeaderComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    ConfirmDialogModule,
    SharedModule,
    SocketIoModule.forRoot(config),
  ],
  exports: [
    MainHeaderComponent
  ],
  providers :[]
})
export class MainHeaderModule { }
