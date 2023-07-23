import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedService } from './shared.service';
import { UserDefaultImage } from './Directives/userDefaultimage.directive';
import { CategoryDefaultImage } from './Directives/categorydefaultimage.derective';
import { ButtonDefaultstyle } from './Directives/ButtonColorDefault.directive';
import { FilterPipe } from './Filters_Pipes/ArrayMergeFilters';
import { UserFilterPipe } from './Filters_Pipes/usernamefilter';
import { DocDefaultImage } from './Directives/docdefaultimage.directive';

import { TranslatePipe } from './Translate/translate.pipe';
import { SafePipe } from "./Filters_Pipes/SafePipe";

@NgModule({
  declarations: [
    UserDefaultImage,
    CategoryDefaultImage,
    ButtonDefaultstyle,
    FilterPipe,
    UserFilterPipe,
    SafePipe,
    DocDefaultImage,
    TranslatePipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    UserDefaultImage,
    CategoryDefaultImage,
    ButtonDefaultstyle,
    FilterPipe,
    SafePipe,
    UserFilterPipe,
    DocDefaultImage,
    TranslatePipe
  ], 
  providers: [SharedService]
})
export class SharedModule {}
