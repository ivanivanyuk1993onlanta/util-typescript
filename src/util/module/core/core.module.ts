import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  HttpClientModule,
  HttpClientXsrfModule,
} from '@angular/common/http';
import {LayoutComponent} from './layout/layout.component';
import {LayoutModule} from '@angular/cdk/layout';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {SharedModule} from '../shared/shared.module';
import {httpInterceptorProvider} from '../../http-interceptor/http-interceptor-provider';

@NgModule({
  declarations: [
    LayoutComponent,
  ],
  exports: [
    CommonModule,
    LayoutComponent,
    SharedModule,
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    HttpClientXsrfModule,
    LayoutModule,
    ReactiveFormsModule,
    RouterModule,
    ScrollDispatchModule,
    SharedModule,
  ],
  providers: [
    httpInterceptorProvider,
  ],
})

export class CoreModule {
}
