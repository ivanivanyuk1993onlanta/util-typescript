import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {InputAutocompletedComponent} from './input-autocompleted/input-autocompleted.component';
import {LayoutComponent} from './layout/layout.component';
import {LayoutModule} from '@angular/cdk/layout';
import {MaterialUsedModule} from './material-used/material-used.module';
import {NgModule} from '@angular/core';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';

@NgModule({
  exports: [
    CommonModule,
    InputAutocompletedComponent,
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
    ScrollDispatchModule,
  ],
  declarations: [LayoutComponent, InputAutocompletedComponent],
})
export class CoreModule {
}
