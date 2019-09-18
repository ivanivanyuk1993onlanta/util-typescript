import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GetDisplayTextContinuous$PurePipe} from './get-display-text-continuous$-pure.pipe';


@NgModule({
  declarations: [GetDisplayTextContinuous$PurePipe],
  exports: [GetDisplayTextContinuous$PurePipe],
  imports: [
    CommonModule
  ]
})
export class GetDisplayTextContinuous$PureModule {
}
