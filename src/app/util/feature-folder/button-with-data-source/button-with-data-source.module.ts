import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonWithDataSourceComponent} from './button-with-data-source/button-with-data-source.component';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {GetDisplayTextContinuous$PureModule} from './data-source/get-display-text-continuous$-pure/get-display-text-continuous$-pure.module';
import {GetIconContinuous$PureModule} from './data-source/get-icon-continuous$-pure/get-icon-continuous$-pure.module';


@NgModule({
  declarations: [ButtonWithDataSourceComponent],
  exports: [
    ButtonWithDataSourceComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    GetDisplayTextContinuous$PureModule,
    GetIconContinuous$PureModule
  ]
})
export class ButtonWithDataSourceModule {
}
