import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WalletComponent } from './wallet.component';
import { WelletRoutingModule } from './wallet-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from '../../modal/modal.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    declarations: [
        WalletComponent,
    ],
    imports: [
      CommonModule,
      WelletRoutingModule,
      FormsModule, ReactiveFormsModule,
      ModalModule,
      SharedModule
    ], providers: []
  })
  export class WalletModule { }
  