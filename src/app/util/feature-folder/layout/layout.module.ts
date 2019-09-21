import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutComponent} from './layout/layout.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';

@NgModule({
  declarations: [LayoutComponent],
  exports: [LayoutComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
  ],
})
export class LayoutModule {
}
