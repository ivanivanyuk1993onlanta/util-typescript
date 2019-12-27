import { FieldMessageDataType } from "./FieldMessageDataType";
import { SchemalessDataObjectType } from "./SchemalessDataObjectType";
import { fieldIdIndex } from "./fieldIdIndex";
import { fieldValueIndex } from "./fieldValueIndex";

export class TransferMessage {
  static deserialize(
    fieldMessageDataList: FieldMessageDataType[]
  ): SchemalessDataObjectType {
    return fieldMessageDataList.reduce(
      (schemalessDataObject, fieldMessageData) => {
        schemalessDataObject[fieldMessageData[fieldIdIndex]] =
          fieldMessageData[fieldValueIndex];
        return schemalessDataObject;
      },
      {} as SchemalessDataObjectType
    );
  }

  static serialize(
    schemalessDataObject: SchemalessDataObjectType
  ): FieldMessageDataType[] {
    return Object.entries(schemalessDataObject).map((fieldId, fieldValue) => {
      return [Number(fieldId), fieldValue];
    });
  }
}
