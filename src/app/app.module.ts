import {AppComponent} from './app/app.component';
import {AppRoutingModule} from './app-routing.module';
import {environment} from '../environments/environment';
import {NgModule} from '@angular/core';
import {ServiceWorkerModule} from '@angular/service-worker';
import {LayoutModule} from './util/feature-folder/layout/layout.module';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {httpInterceptorProvider} from './util/http-interceptor/http-interceptor-provider';
import {FlexSpacerComponent} from './util/feature-folder/flex-spacer/flex-spacer.component';
import {ProfileMenuModule} from './util/feature-folder/profile-menu/profile-menu.module';
import {RegisterFormComponent} from './util/feature-folder/register-form/register-form.component';
import {RouteListModule} from './util/feature-folder/route-list_/route-list.module';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    FlexSpacerComponent,
    RegisterFormComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    HttpClientModule,
    HttpClientXsrfModule,
    LayoutModule,
    ProfileMenuModule,
    RouteListModule,
    ServiceWorkerModule.register(
      'ngsw-worker.js',
      {enabled: environment.production},
    ),
  ],
  providers: [
    httpInterceptorProvider,
  ],
})
export class AppModule {
}

// todo think about moving translate logic to server for correct permission check
// todo obfuscate protobuf/load from server/do something to hide field names, field counts
