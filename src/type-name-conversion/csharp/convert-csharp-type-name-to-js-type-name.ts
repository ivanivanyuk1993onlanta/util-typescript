import {jsBooleanTypeName} from '../../js-data-type-name/js-boolean-type-name';
import {csharpBooleanDataTypeNameSet} from './csharp-data-type-name-set/csharp-boolean-data-type-name-set';
import {csharpDateTimeTypeName} from './csharp-data-type-name/csharp-date-time-type-name';
import {csharpStringDataTypeNameSet} from './csharp-data-type-name-set/csharp-string-data-type-name-set';
import {jsStringTypeName} from '../../js-data-type-name/js-string-type-name';
import {csharpNumericDataTypeNameSet} from './csharp-data-type-name-set/csharp-numeric-data-type-name-set';
import {jsNumberTypeName} from '../../js-data-type-name/js-number-type-name';

const csharpTypeNameToJsTypeNameMap = new Map<string, string>([
  ...Array.from(csharpBooleanDataTypeNameSet.keys()).map(csharpTypeName => {
    return [csharpTypeName, jsBooleanTypeName] as readonly [string, string];
  }),
  ...Array.from(csharpNumericDataTypeNameSet.keys()).map(csharpTypeName => {
    return [csharpTypeName, jsNumberTypeName] as readonly [string, string];
  }),
  ...Array.from(csharpStringDataTypeNameSet.keys()).map(csharpTypeName => {
    return [csharpTypeName, jsStringTypeName] as readonly [string, string];
  }),
  [csharpDateTimeTypeName, jsBooleanTypeName],
]);

export function convertCsharpTypeNameToJsTypeName(
  csharpTypeName: string
): string {
  // todo вынести 'object' в константу
  return csharpTypeNameToJsTypeNameMap.get(csharpTypeName) || 'object';
}
