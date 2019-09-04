import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsNanPurePipe } from './is-nan-pure.pipe';



@NgModule({
  declarations: [IsNanPurePipe],
  exports: [
    IsNanPurePipe
  ],
  imports: [
    CommonModule
  ]
})
export class IsNanPureModule { }
