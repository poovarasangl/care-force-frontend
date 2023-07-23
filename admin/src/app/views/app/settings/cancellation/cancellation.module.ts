import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ComponentsStateButtonModule } from 'src/app/components/state-button/components.state-button.module';
import { CommonFuctionModule } from "src/app/common/common.module";
import { CancellationRoutingModule } from './cancellation-routing.module';
import { CancellationlistComponent } from './cancellationlist/cancellationlist.component';
import { CancellationeditComponent } from './cancellationedit/cancellationedit.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CancellationlistComponent, CancellationeditComponent],
  imports: [
    CommonModule,
    FormsModule,
    CancellationRoutingModule,
    ReactiveFormsModule,
    CommonFuctionModule,
    SimpleNotificationsModule.forRoot(),
    ComponentsStateButtonModule,
    NgSelectModule,
    LayoutContainersModule,
    SharedModule
  ]
})
export class CancellationModule { }
