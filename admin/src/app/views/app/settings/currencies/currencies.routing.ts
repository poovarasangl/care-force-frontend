import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrenciesComponent } from './currencies.component';
import { CurrencyeditComponent } from './currencyedit/currencyedit.component';
import { CurrencylistComponent } from './currencylist/currencylist.component';

const routes: Routes = [
    {
        path: '', component: CurrenciesComponent,
        children: [
            { path: '', redirectTo: 'currencylist', pathMatch: 'full' },
            { path: 'currencylist', component: CurrencylistComponent },
            { path: 'currencyedit/:id', component: CurrencyeditComponent },
            { path: 'currencyadd', component: CurrencyeditComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CurrenciesRoutingModule { }
