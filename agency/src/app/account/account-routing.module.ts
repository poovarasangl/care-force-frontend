import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountComponent } from './account.component';
import { AppGuard } from '../guard/auth.guard';

const routes: Routes = [{
  path: '',
  component: AccountComponent,
  children: [{
    path: 'about',
    loadChildren:()=>import('./about/about.module').then(mod=>mod.AboutModule),
    canLoad: [AppGuard]
  }, {
    path: 'availability',
    loadChildren:()=>import('./availability/availability.module').then(mod=>mod.AvailabilityModule),
    canLoad: [AppGuard]
  }, {
    path: 'bank-account',
    loadChildren:()=>import('./bank-account/bank-account.module').then(mod=>mod.BankAccountModule),
    canLoad: [AppGuard]
  }, {
    path: 'category',
    loadChildren:()=>import('./category/category.module').then(mod=>mod.CategoryModule),
    canLoad: [AppGuard]
  }, {
    path: 'documents',
    loadChildren:()=>import('./documents/documents.module').then(mod=>mod.DocumentsModule),
    canLoad: [AppGuard]
  }, {
    path: 'job-details',
    loadChildren:()=>import('./job-details/job-details.module').then(mod=>mod.JobDetailsModule),
    canLoad: [AppGuard]
  }, {
    path: 'profile',
    loadChildren:()=> import('./profile/profile.module').then(mod=>mod.ProfileModule),
    canLoad: [AppGuard]
  }, {
    path: 'reviews',
    loadChildren:()=> import('./reviews/reviews.module').then(mod => mod.ReviewsModule),
    canLoad: [AppGuard]
  }, {
    path: 'transactions',
    loadChildren: () => import('./transactions/transactions.module').then(mod => mod.TransactionsModule),
    canLoad: [AppGuard]
  }, {
    path: 'address',
    loadChildren: () => import('./address/address.module').then(mod => mod.AddressModule),
    canLoad: [AppGuard]
  },
  {
    path: 'wallet/:message',
    loadChildren: () => import('./wallet/wallet.module').then(mod => mod.WalletModule),
    canLoad: [AppGuard]
  }, {
    path: 'invite-friends',
    loadChildren:()=> import('./invite-friends/invite-friends.module').then(mod=>mod.InviteFriendsModule),
    canLoad: [AppGuard]
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
