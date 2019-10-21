import {jsBooleanTypeName} from '../../js-data-type-name/js-boolean-type-name';
import {csharpBooleanTypeName} from './csharp-data-type-name/csharp-boolean-type-name';

const jsTypeNameToCsharpTypeNameMap = new Map<string, string>([
  [jsBooleanTypeName, csharpBooleanTypeName],
]);

export function convertJsTypeNameToCsharpTypeName(
  jsTypeName: string
): string {
  // todo вынести 'Object' в константу
  return jsTypeNameToCsharpTypeNameMap.get(jsTypeName) || 'Object';
}
