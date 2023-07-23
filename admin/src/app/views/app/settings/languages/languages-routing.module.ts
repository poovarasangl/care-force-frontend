import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LanguageeditComponent } from './languageedit/languageedit.component';
import { LanguagelistComponent } from './languagelist/languagelist.component';
import { LanguagemanageComponent } from './languagemanage/languagemanage.component';
import { LanguagemanageaddComponent } from './languagemanageadd/languagemanageadd.component';
import { LanguagemobileComponent } from './languagemobile/languagemobile.component';
import { LanguagemobileaddComponent } from './languagemobileadd/languagemobileadd.component';
import { LanguagesComponent } from './languages.component';


const routes: Routes = [
  {
    path: '', component: LanguagesComponent,
    children: [
        { path: '', redirectTo: 'languagelist', pathMatch: 'full' },
        { path: 'languagelist', component: LanguagelistComponent },
        { path: 'languageedit/:id', component: LanguageeditComponent },
        { path: 'languageadd', component: LanguageeditComponent },
        { path: 'manage/:id', component: LanguagemanageComponent },
        { path: 'mobile/:id', component: LanguagemobileComponent },
        { path: 'manage-add', component: LanguagemanageaddComponent },
        { path: 'mobile-add', component: LanguagemobileaddComponent },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LanguagesRoutingModule { }
