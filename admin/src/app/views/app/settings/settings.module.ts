import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralComponent } from './general/general.component';
import { SmtpComponent } from './smtp/smtp.component';
import { SocialNetworkComponent } from './social-network/social-network.component';
import { CurrenciesComponent } from './currencies/currencies.component';
import { LanguagesComponent } from "./languages/languages.component";
import { CancellationComponent } from './cancellation/cancellation.component';
import { AppearanceComponent } from './appearance/appearance.component';
import { PostHeaderComponent } from './post-header/post-header.component';
import { MobileComponent } from './mobile/mobile.component';
import { SeoComponent } from './seo/seo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsRoutingModule } from "./setting.routing";
import { SettingComponent } from "./setting.component";
import { SharedModule } from 'src/app/shared/shared.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [SettingComponent,GeneralComponent, SmtpComponent, SocialNetworkComponent, CurrenciesComponent, LanguagesComponent, CancellationComponent, AppearanceComponent, PostHeaderComponent, MobileComponent, SeoComponent ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SettingsRoutingModule,
    SharedModule,
    LayoutContainersModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule,
    NgSelectModule
  ]
})
export class SettingsModule { }
