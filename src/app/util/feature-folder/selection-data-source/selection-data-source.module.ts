import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { IsSelectedContinuous$PurePipe } from './is-selected-continuous$-pure/is-selected-continuous$-pure.pipe';


@NgModule({
  exports: [IsSelectedContinuous$PurePipe],
  declarations: [IsSelectedContinuous$PurePipe],
  imports: [
    CommonModule
  ]
})
export class SelectionDataSourceModule {
}
