import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexSpacerComponent } from './flex-spacer/flex-spacer.component';

@NgModule({
  declarations: [FlexSpacerComponent],
  exports: [
    FlexSpacerComponent
  ],
  imports: [
    CommonModule
  ]
})
export class FlexSpacerModule { }
