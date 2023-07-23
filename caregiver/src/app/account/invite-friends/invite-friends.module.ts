import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InviteFriendsRoutingModule } from './invite-friends-routing.module';
import { InviteFriendsComponent } from './invite-friends.component';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [InviteFriendsComponent],
  imports: [
    CommonModule,
    InviteFriendsRoutingModule,
    SharedModule
  ]
})
export class InviteFriendsModule { }
