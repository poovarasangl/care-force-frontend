import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { NgSelectModule } from '@ng-select/ng-select';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { BootstrapModule } from 'src/app/components/bootstrap/bootstrap.module';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { UsersComponent } from "./users.component";
import { UsersRoutingModule } from './users-routing.module';
import { UserlistComponent } from './userlist/userlist.component';
import { AdduserComponent } from './adduser/adduser.component';
import { CommonFuctionModule } from 'src/app/common/common.module';
import { WalletComponent } from './wallet/wallet.component';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AgmCoreModule } from '@agm/core';


@NgModule({

	declarations: [UsersComponent, UserlistComponent, AdduserComponent, WalletComponent],
	imports: [
		CommonModule,
		UsersRoutingModule,
		CommonFuctionModule,
		FormsModule,
		ReactiveFormsModule,
		QuillModule,
		NgSelectModule,
		SimpleNotificationsModule,
		ComponentsStateButtonModule,
		Ng2TelInputModule,
		BootstrapModule,
		LayoutContainersModule,
		SharedModule,
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyCyHt1_Lmid3TUTRwo5QERrr5crmC1t6_U',
			libraries: ["places"],
		}),
	]
})
export class UsersModule { }
