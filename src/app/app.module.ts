import {AppComponent} from './app/app.component';
import {AppRoutingModule} from './app-routing.module';
import {environment} from '../environments/environment';
import {NgModule} from '@angular/core';
import {ServiceWorkerModule} from '@angular/service-worker';
import {LayoutModule} from './util/feature-folder/layout/layout.module';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouteListModule} from './util/feature-folder/route-list/route-list.module';
import {AuthInterceptor} from './util/feature-folder/auth/interceptor/auth-interceptor';
import {FlexSpacerModule} from './util/feature-folder/flex-spacer/flex-spacer.module';
import {AuthModule} from './util/feature-folder/auth/auth.module';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    HttpClientModule,
    LayoutModule,
    RouteListModule,
    ServiceWorkerModule.register(
      'ngsw-worker.js',
      {enabled: environment.production},
    ),
    FlexSpacerModule,
    AuthModule,
  ],
  providers: [
    [
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ]
  ],
})
export class AppModule {
}
