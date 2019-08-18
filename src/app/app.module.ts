import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {LayoutModule} from './util/feature-folder/layout/layout.module';
import {FlexSpacerModule} from './util/feature-folder/flex-spacer/flex-spacer.module';
import {RouteListModule} from './util/feature-folder/route-list/route-list.module';
import {RouterModule} from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AuthInterceptor} from './util/feature-folder/auth/interceptor/auth-interceptor';
import {AuthModule} from './util/feature-folder/auth/auth.module';
import {NotificationModule} from './util/feature-folder/notification/notification.module';
import {LocalizationModule} from './util/feature-folder/localization/localization.module';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    AuthModule,
    BrowserAnimationsModule,
    BrowserModule,
    FlexSpacerModule,
    HttpClientModule,
    LayoutModule,
    NotificationModule,
    RouteListModule,
    RouterModule,
    LocalizationModule,
  ],
  providers: [
    [
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ]
  ],
})
export class AppModule { }
