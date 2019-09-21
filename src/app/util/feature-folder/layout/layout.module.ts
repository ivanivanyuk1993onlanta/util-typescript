import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutComponent} from './layout/layout.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {GetSideNavContainerNgClassContinuous$PureModule} from './data-source/get-side-nav-container-ng-class-continuous$-pure/get-side-nav-container-ng-class-continuous$-pure.module';
import {GetMatToolBarColorContinuous$PureModule} from './data-source/get-mat-tool-bar-color-continuous$-pure/get-mat-tool-bar-color-continuous$-pure.module';

@NgModule({
  declarations: [LayoutComponent],
  exports: [LayoutComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    GetSideNavContainerNgClassContinuous$PureModule,
    GetMatToolBarColorContinuous$PureModule,
  ],
})
export class LayoutModule {
}
