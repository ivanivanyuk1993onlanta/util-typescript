import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetIconContinuous$PurePipe } from './get-icon-continuous$-pure.pipe';



@NgModule({
  declarations: [GetIconContinuous$PurePipe],
  exports: [
    GetIconContinuous$PurePipe
  ],
  imports: [
    CommonModule
  ]
})
export class GetIconContinuous$PureModule { }
