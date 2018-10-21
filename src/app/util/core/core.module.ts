import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {InputAutocompletedComponent} from './input-autocompleted/input-autocompleted.component';
import {LayoutComponent} from './layout/layout.component';
import {LayoutModule} from '@angular/cdk/layout';
import {NgModule} from '@angular/core';
import {MaterialUsedModule} from './material-used/material-used.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  exports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    InputAutocompletedComponent,
    LayoutComponent,
    MaterialUsedModule,
    ReactiveFormsModule,
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    LayoutModule,
    MaterialUsedModule,
    ReactiveFormsModule,
  ],
  declarations: [LayoutComponent, InputAutocompletedComponent]
})
export class CoreModule {
}
