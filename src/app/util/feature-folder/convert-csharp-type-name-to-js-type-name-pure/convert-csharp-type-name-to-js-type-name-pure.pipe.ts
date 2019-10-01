import {Pipe, PipeTransform} from '@angular/core';
import {convertCsharpTypeNameToJsTypeName} from '../../typescript-util/type-name-conversion/csharp/convert-csharp-type-name-to-js-type-name';

@Pipe({
  name: 'convertCsharpTypeNameToJsTypeNamePure'
})
export class ConvertCsharpTypeNameToJsTypeNamePurePipe implements PipeTransform {
  transform(csharpTypeName: string) {
    return convertCsharpTypeNameToJsTypeName(csharpTypeName);
  }
}
