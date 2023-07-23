import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppGuard } from './guard/auth.guard';
import { AppregGuard } from './guard/auth.guard_reg';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
	// LANDING
	{
		path: '',
		loadChildren: () => import('./home/home.module').then(mod => mod.HomeModule)
	},
	// LOGIN
	{
		path: 'login',
		loadChildren: () => import('./login/login.module').then(mod => mod.LoginModule)
	},
	// REGISTER
	{
		path: 'register',
		loadChildren: () => import('./register/register.module').then(mod => mod.RegisterModule)
	},
	//Tasker REGISTER
	{
		path: 'tasker-register',
		loadChildren: () => import('./tasker-register/tasker-register.module').then(mod => mod.TaskerRegisterModule),
		canLoad: [AppregGuard],
	},
	// contactus
	{
		path: 'contactus',
		loadChildren: () => import('./contactus/contactus.module').then(mod => mod.ContactusModule)
	},
	// ACCOUNT
	{
		path: 'account',
		loadChildren: () => import('./account/account.module').then(mod => mod.AccountModule),
		canLoad: [AppGuard]
	},
	// Main Category
	{
		path: 'main-category',
		loadChildren: () => import('./category/main-category/main-category.module').then(mod => mod.MainCategoryModule),
		canLoad: [AppGuard]
	},
	// Sub Category
	{
		path: 'sub-category/:slug',
		loadChildren: () => import('./category/sub-category/sub-category.module').then(mod => mod.SubCategoryModule)
	},
	// Pages
	{
		path: 'page/:slug',
		loadChildren: () => import('./pages/pages.module').then(mod => mod.PagesModule),
		canLoad: [AppGuard]
	},
	// View - profile
	{
		path: 'view-profile/:username',
		loadChildren: () => import('./view-profile/view-profile.module').then(mod => mod.ViewProfileModule),
		canLoad: [AppGuard]
	},
	// Task
	{
		path: 'task',
		loadChildren: () => import('./task/task.module').then(mod => mod.TaskModule)
	},
	// Messages
	{
		path: 'messages',
		loadChildren: () => import('./messages/messages.module').then(mod => mod.MessagesModule),
		canLoad: [AppGuard]
	},
	// Notifications
	{
		path: 'notifications',
		loadChildren: () => import('./notification/notification.module').then(mod => mod.NotificationModule),
		canLoad: [AppGuard]
	},
	// Chat
	{
		path: 'chat',
		loadChildren: () => import('./chat/chat.module').then(mod => mod.ChatModule),
		canLoad: [AppGuard]
	},
	// Task payment page
	{
		path: 'carddeatil/:message',
		loadChildren: () => import('./carddetails/carddetails.module').then(mod => mod.CarddetailsModule),
		canLoad: [AppGuard]
	},
	{
		path: 'jobdetails/:id',
		loadChildren: () => import('./progressbar/progressbar.module').then(mod => mod.ProgressbarModule),
		
	},
	{path: '404', component: NotFoundComponent},
 	{path: '', redirectTo: '', pathMatch: 'full'},
 	{path: '**', redirectTo: '', pathMatch: 'full'}
];
@NgModule({
	imports: [RouterModule.forRoot(routes,{
		scrollPositionRestoration: 'enabled'
	  })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
