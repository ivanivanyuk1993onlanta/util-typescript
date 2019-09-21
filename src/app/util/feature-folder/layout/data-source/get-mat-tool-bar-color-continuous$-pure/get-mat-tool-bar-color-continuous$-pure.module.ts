import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetMatToolBarColorContinuous$PurePipe } from './get-mat-tool-bar-color-continuous$-pure.pipe';



@NgModule({
  declarations: [GetMatToolBarColorContinuous$PurePipe],
  exports: [
    GetMatToolBarColorContinuous$PurePipe
  ],
  imports: [
    CommonModule
  ]
})
export class GetMatToolBarColorContinuous$PureModule { }
