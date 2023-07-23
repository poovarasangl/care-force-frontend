import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SitePageComponent } from "./site-page.component";
import { AllpagesComponent } from './allpages/allpages.component';
import { AddpageComponent } from './addpage/addpage.component';
import { AddtranslatepageComponent } from './addtranslatepage/addtranslatepage.component';
import { LanguageslistComponent } from './languageslist/languageslist.component';

const routes: Routes = [
    {
        path: '', component: SitePageComponent,
        children: [
            { path: '', redirectTo: 'allpages', pathMatch: 'full' },
            { path: 'allpages', component: AllpagesComponent },
            { path: 'addpage', component: AddpageComponent },
            { path: 'editpage/:id', component: AddpageComponent },
            { path: 'addtranslate', component: AddtranslatepageComponent },
            { path: 'edittranslate/:id', component: AddtranslatepageComponent },
            { path: 'languages/:id', component: LanguageslistComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SitePageRoutingModule { }