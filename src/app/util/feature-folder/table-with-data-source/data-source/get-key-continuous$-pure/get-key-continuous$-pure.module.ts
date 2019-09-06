import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GetKeyContinuous$PurePipe} from './get-key-continuous$-pure.pipe';


@NgModule({
  declarations: [
    GetKeyContinuous$PurePipe,
  ],
  exports: [
    GetKeyContinuous$PurePipe
  ],
  imports: [
    CommonModule
  ]
})
export class GetKeyContinuous$PureModule {
}
