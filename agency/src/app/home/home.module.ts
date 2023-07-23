import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home.component';
import { HomeService } from './home.service';
import { SharedModule } from '../shared/shared.module';
import { CarouselDirective } from './carousel.directive';
import { SocketService } from '../socket.service';

@NgModule({
  declarations: [
    HomeComponent,
    CarouselDirective
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    HttpClientModule,
    SharedModule,

  ],
  providers: [HomeService, SocketService]
})
export class HomeModule { }