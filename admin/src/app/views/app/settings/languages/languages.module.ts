import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { CommonFuctionModule } from "src/app/common/common.module";
import { LanguagesRoutingModule } from './languages-routing.module';
import { LanguagelistComponent } from './languagelist/languagelist.component';
import { LanguageeditComponent } from './languageedit/languageedit.component';
import { LanguagemanageComponent } from './languagemanage/languagemanage.component';
import { LanguagemobileComponent } from './languagemobile/languagemobile.component';
import { LanguagemanageaddComponent } from './languagemanageadd/languagemanageadd.component';
import { LanguagemobileaddComponent } from './languagemobileadd/languagemobileadd.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [LanguagelistComponent, LanguageeditComponent, LanguagemanageComponent, LanguagemobileComponent, LanguagemanageaddComponent, LanguagemobileaddComponent],
  imports: [
    LanguagesRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonFuctionModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule,
    NgSelectModule,
    LayoutContainersModule,
    SharedModule
  ]
})
export class LanguagesModule { }
