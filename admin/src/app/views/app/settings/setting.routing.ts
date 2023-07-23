import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppearanceComponent } from './appearance/appearance.component';
import { GeneralComponent } from './general/general.component';
import { MobileComponent } from './mobile/mobile.component';
import { SeoComponent } from './seo/seo.component';
import { SettingComponent } from "./setting.component";
import { SmtpComponent } from './smtp/smtp.component';
import { SocialNetworkComponent } from './social-network/social-network.component';


const routes: Routes = [
    {
        path: '', component: SettingComponent,
        children: [
            { path: '', redirectTo: 'general', pathMatch: 'full' },
            { path: 'general', component: GeneralComponent },
            { path: 'seo', component: SeoComponent },
            { path: 'smtp', component: SmtpComponent },
            { path: 'appearance', component: AppearanceComponent },
            { path: 'cancellation', loadChildren: () => import('./cancellation/cancellation.module').then(m => m.CancellationModule) },
            { path: 'currencies', loadChildren: () => import('./currencies/currencies.module').then(m => m.CurrenciesModule) },
            { path: 'languages', loadChildren: () => import('./languages/languages.module').then(m => m.LanguagesModule) },
            { path: 'postheader', loadChildren: () => import('./post-header/post-header.module').then(m => m.PostHeaderModule) },
            { path: 'mobile', component: MobileComponent },
            { path: 'socialnetwork', component: SocialNetworkComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingsRoutingModule { }
