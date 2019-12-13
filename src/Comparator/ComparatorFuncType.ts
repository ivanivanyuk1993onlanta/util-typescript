import { ComparatorFuncResultEnum } from "./ComparatorFuncResultEnum";

export type ComparatorFuncType<ValueType> = (
  left: ValueType,
  right: ValueType
) => ComparatorFuncResultEnum;
