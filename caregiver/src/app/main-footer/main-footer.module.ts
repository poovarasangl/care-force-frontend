import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainFooterComponent } from './main-footer.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from "../shared/shared.module";
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [MainFooterComponent],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    SharedModule,
    FormsModule
  ],
  exports :[
    MainFooterComponent
  ]
})
export class MainFooterModule { }
