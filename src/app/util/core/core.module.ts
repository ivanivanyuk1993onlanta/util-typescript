import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {LayoutComponent} from './layout/layout.component';
import {LayoutModule} from '@angular/cdk/layout';
import {MaterialUsedModule} from './material-used/material-used.module';
import {NgModule} from '@angular/core';
import {RouteListModule} from './route-list/route-list.module';
import {RouterModule} from '@angular/router';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  exports: [
    CommonModule,
    LayoutComponent,
    MaterialUsedModule,
    RouteListModule,
    SharedModule,
  ],
  declarations: [
    LayoutComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    LayoutModule,
    MaterialUsedModule,
    ReactiveFormsModule,
    RouteListModule,
    RouterModule,
    ScrollDispatchModule,
    SharedModule,
  ],
})

export class CoreModule {
}
