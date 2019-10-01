import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapGetPurePipe } from './map-get-pure.pipe';



@NgModule({
  declarations: [MapGetPurePipe],
  exports: [
    MapGetPurePipe
  ],
  imports: [
    CommonModule
  ]
})
export class MapGetPureModule { }
