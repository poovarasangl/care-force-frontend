import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { UserlistComponent } from './userlist/userlist.component';
import { AdduserComponent } from './adduser/adduser.component';
import { WalletComponent } from './wallet/wallet.component';

const routes: Routes = [
	{
		path: '', component: UsersComponent,
		children: [
			{ path: '', redirectTo: 'list', pathMatch: 'full' },
			{ path: 'list', component: UserlistComponent },
			{ path: 'add', component: AdduserComponent },
			{ path: 'edit/:id', component: AdduserComponent },
			{ path: 'wallet/:id', component: WalletComponent }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class UsersRoutingModule { }
