import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConvertCsharpTypeNameToJsTypeNamePurePipe } from './convert-csharp-type-name-to-js-type-name-pure.pipe';



@NgModule({
  declarations: [ConvertCsharpTypeNameToJsTypeNamePurePipe],
  exports: [
    ConvertCsharpTypeNameToJsTypeNamePurePipe
  ],
  imports: [
    CommonModule
  ]
})
export class ConvertCsharpTypeNameToJsTypeNamePureModule { }
