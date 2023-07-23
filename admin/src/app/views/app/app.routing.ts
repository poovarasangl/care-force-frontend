import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BlankPageComponent } from './blank-page/blank-page.component';

const routes: Routes = [
    {
        path: '', component: AppComponent,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'dashboards' },
            { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
            { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
            { path: 'applications', loadChildren: () => import('./applications/applications.module').then(m => m.ApplicationsModule) },
            { path: 'pages', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) },
            { path: 'ui', loadChildren: () => import('./ui/ui.module').then(m => m.UiModule) },
            { path: 'menu', loadChildren: () => import('./menu/menu.module').then(m => m.MenuModule) },
            { path: 'blank-page', component: BlankPageComponent },
            { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
            { path: 'administrator', loadChildren: () => import('./administrator/administrator.module').then(m => m.AdministratorModule) },
            { path: 'agency', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },
            { path: 'site-page', loadChildren: () => import('./site-page/site-page.module').then(m => m.SitePageModule) },
            { path: 'contact', loadChildren: () => import('./contactus/contactus.module').then(m => m.ContactusModule) },
            { path: 'categories', loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule) },
            { path: 'gateway', loadChildren: () => import('./gateway/gateway.module').then(m => m.GatewayModule) },
            { path: 'coupons', loadChildren: () => import('./coupons/coupons.module').then(m => m.CouponsModule) },
            { path: 'experts', loadChildren: () => import('./experts/experts.module').then(m => m.ExpertsModule) },
            { path: 'earnings', loadChildren: () => import('./earnings/earnings.module').then(m => m.EarningsModule) },
            { path: 'pushnotifications', loadChildren: ()=> import('./pushnotifications/pushnotifications.module').then(m=>m.PushnotificationsModule)},
            { path: 'reviews', loadChildren: ()=> import('./reviews/reviews.module').then(m=>m.ReviewsModule)},
            { path: 'expertsmanagement', loadChildren: ()=> import('./expertsmanagement/expertsmanagement.module').then(m=>m.ExpertsmanagementModule)},
            { path: 'subscribers', loadChildren: ()=> import('./subscribers/subscribers.module').then(m=>m.SubscribersModule)},
            { path: 'email-template', loadChildren: ()=> import('./email/email.module').then(m=>m.EmailModule)},
            { path: 'peoplecomments', loadChildren: ()=> import('./peoplecomments/peoplecomments.module').then(m=>m.PeoplecommentsModule)},
            { path: 'paymentsprice', loadChildren: ()=> import('./paymentprice/paymentprice.module').then(m=>m.PaymentpriceModule)},
            { path: 'jobs', loadChildren: () => import('./jobs/jobs.module').then(m => m.JobsModule) }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
