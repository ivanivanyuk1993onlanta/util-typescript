import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {LayoutComponent} from './layout/layout.component';
import {LayoutModule} from '@angular/cdk/layout';
import {MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule} from '@angular/material';
import {NgModule} from '@angular/core';

@NgModule({
  exports: [
    BrowserModule,
    CommonModule,
    LayoutComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    LayoutModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
  ],
  declarations: [LayoutComponent]
})
export class CoreModule {
}
