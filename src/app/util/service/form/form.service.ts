import {Injectable} from '@angular/core';
import {ProtoDescriptorService} from '../proto-descriptor/proto-descriptor.service';
import {StorageWrap} from '../../class-folder/storage/storage';
import {ResolvablePromise} from '../../class-folder/resolvable-promise/resolvable-promise';
import {FormFieldBase} from './form-field-base';
import {ucfirst} from '../../method/ucfirst';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private _fieldNumberToFieldDescriptorProtoObjectMapStorage: StorageWrap;

  constructor(
    private _protoDescriptorService: ProtoDescriptorService,
  ) {
    this._fieldNumberToFieldDescriptorProtoObjectMapStorage = new StorageWrap(
      'field-number-to-field-descriptor-proto-object-map',
    );
  }

  public static getFormFieldList(
    tableName: string,
    messageWithUiPermissionDataProto,
    fieldNumberToFieldDescriptorProtoObjectMap,
  ): FormFieldBase<any>[] {
    const formFieldList = new Array<FormFieldBase<any>>();
    for (const fieldNumber of messageWithUiPermissionDataProto.getUiPermissionData().
      getPermittedToReadFieldNumberListList()) {

      const getterName = `get${ucfirst(
        fieldNumberToFieldDescriptorProtoObjectMap[fieldNumber].jsonName,
      )}`;

      const fieldName = fieldNumberToFieldDescriptorProtoObjectMap[fieldNumber].name;

      formFieldList.push(
        new FormFieldBase({
          fieldName: fieldName,
          fieldNumber: fieldNumber,
          langKey: `${tableName}.${fieldName}`,
          order: fieldNumber,
          value: messageWithUiPermissionDataProto.getData()[getterName](),
        }),
      );
    }
    return formFieldList.sort((left, right) => left.order - right.order);
  }

  getFieldNumberToFieldDescriptorProtoObjectMapPromise(
    tableName: string,
  ): Promise<any> {
    const fieldNumberToFieldDescriptorProtoObjectMapPromise = new ResolvablePromise<any>();

    this._fieldNumberToFieldDescriptorProtoObjectMapStorage.get(tableName).
      then((fieldNumberToFieldDescriptorProtoObjectMap) => {
        if (fieldNumberToFieldDescriptorProtoObjectMap !== null) {
          fieldNumberToFieldDescriptorProtoObjectMapPromise.resolve(
            fieldNumberToFieldDescriptorProtoObjectMap,
          );
        } else {
          this._protoDescriptorService.getDescriptorProto(tableName).
            then((descriptorProto) => {
              const fieldNumberToFieldDescriptorProtoObjectMapLocal = descriptorProto.getFieldList().
                reduce((acc, item) => {
                  const object = item.toObject();
                  acc[object.number] = object;
                  return acc;
                }, {});

              this._fieldNumberToFieldDescriptorProtoObjectMapStorage.set(
                tableName,
                fieldNumberToFieldDescriptorProtoObjectMapLocal,
              ).then(() => {
                fieldNumberToFieldDescriptorProtoObjectMapPromise.resolve(
                  fieldNumberToFieldDescriptorProtoObjectMapLocal,
                );
              });
            });
        }
      });

    return fieldNumberToFieldDescriptorProtoObjectMapPromise.promise;
  }
}
