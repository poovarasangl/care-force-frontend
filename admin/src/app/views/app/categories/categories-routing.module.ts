import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesComponent } from './categories.component';
import { MaincategorieseditComponent } from './maincategoriesedit/maincategoriesedit.component';
import { MaincategorieslistComponent } from './maincategorieslist/maincategorieslist.component';
import { SubcategorieseditComponent } from './subcategoriesedit/subcategoriesedit.component';
import { SubcategorieslistComponent } from './subcategorieslist/subcategorieslist.component';

const routes: Routes = [
  {
    path: '', component: CategoriesComponent,
    children: [
      { path: '', redirectTo: 'mainlist', pathMatch: 'full' },
      { path: 'mainlist', component: MaincategorieslistComponent },
      { path: 'mainedit/:id', component: MaincategorieseditComponent },
      { path: 'maincat-add', component: MaincategorieseditComponent },
      { path: 'sublist', component: SubcategorieslistComponent },
      { path: 'subedit/:id', component: SubcategorieseditComponent },
      { path: 'subcat-add', component: SubcategorieseditComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
