import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonParsePurePipe } from './json-parse-pure.pipe';



@NgModule({
  declarations: [JsonParsePurePipe],
  exports: [
    JsonParsePurePipe
  ],
  imports: [
    CommonModule
  ]
})
export class JsonParsePureModule { }
