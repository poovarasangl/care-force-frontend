import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostHeaderComponent } from './post-header.component';
import { PostheadereditComponent } from './postheaderedit/postheaderedit.component';
import { PostheaderlistComponent } from './postheaderlist/postheaderlist.component';

const routes: Routes = [
    {
        path: '', component: PostHeaderComponent,
        children: [
            { path: '', redirectTo: 'postheaderlist', pathMatch: 'full' },
            { path: 'postheaderlist', component: PostheaderlistComponent },
            { path: 'postheaderedit/:id', component: PostheadereditComponent },
            { path: 'postheaderadd', component: PostheadereditComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PostHeaderRoutingModule { }
