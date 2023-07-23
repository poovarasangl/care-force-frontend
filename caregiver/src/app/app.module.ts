import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppService } from './app.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { AlertModule } from './alert/alert.module';
import { SpinnerModule } from './spinner/spinner.module';
import { MainFooterModule } from './main-footer/main-footer.module';
import { MainHeaderModule } from './main-header/main-header.module';
import { TranslateService } from './shared/Translate/translate.service';
import { AppSettings } from './shared/Translate/AppSetting';
import { SocketIoModule } from 'ngx-socket-io';
import { SocketService } from './socket.service';

export function setupTranslateFactory(service: TranslateService): Function {
	return () => service.use(AppSettings.language);
}

@NgModule({
	declarations: [
		AppComponent,
		NotFoundComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		BrowserAnimationsModule,
		AlertModule,
		SpinnerModule,
		MainFooterModule,
		MainHeaderModule,
		SocketIoModule
	],
	exports: [],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: AppService, multi: true }
		,SocketService,TranslateService,
		{
			provide: APP_INITIALIZER,
			useFactory: setupTranslateFactory,
			deps: [TranslateService],
			multi: true
		}],
	bootstrap: [AppComponent]
})
export class AppModule { }