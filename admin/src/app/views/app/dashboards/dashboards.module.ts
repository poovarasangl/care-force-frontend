import { NgModule } from '@angular/core';
import { DashboardsComponent } from './dashboards.component';
import { DashboardsRoutingModule } from './dashboards.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardsContainersModule } from 'src/app/containers/dashboards/dashboards.containers.module';
import { ComponentsCardsModule } from 'src/app/components/cards/components.cards.module';
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { ComponentsChartModule } from 'src/app/components/charts/components.charts.module';
import { DecimalPipe } from '@angular/common';

@NgModule({
  declarations: [DashboardsComponent],
  imports: [
    SharedModule,
    LayoutContainersModule,
    DashboardsContainersModule,
    DashboardsRoutingModule,
    ComponentsCardsModule,
    ComponentsChartModule,
    SharedModule
  ],
  providers: [DecimalPipe],
})
export class DashboardsModule { }
