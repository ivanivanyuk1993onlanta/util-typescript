import {Injectable} from '@angular/core';
import {ProtoDescriptorService} from '../proto-descriptor/proto-descriptor.service';
import {StorageWrap} from '../../class/storage/storage';
import {ResolvablePromise} from '../../class/resolvable-promise/resolvable-promise';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private _fieldNumberToFieldDescriptorProtoObjectMapStorage: StorageWrap;

  constructor(
    private _protoDescriptorService: ProtoDescriptorService,
  ) {
    this._fieldNumberToFieldDescriptorProtoObjectMapStorage = new StorageWrap(
      'field-number-to-field-descriptor-proto-object-map');
  }

  getFieldNumberToFieldDescriptorProtoObjectMap(
    tableName: string,
    url: string,
  ): Promise<any> {
    const fieldNumberToFieldDescriptorProtoObjectMapPromise = new ResolvablePromise<any>();

    this._fieldNumberToFieldDescriptorProtoObjectMapStorage.get(tableName).
      then((fieldNumberToFieldDescriptorProtoObjectMap) => {
        if (fieldNumberToFieldDescriptorProtoObjectMap !== null) {
          fieldNumberToFieldDescriptorProtoObjectMapPromise.resolve(
            fieldNumberToFieldDescriptorProtoObjectMap,
          );
        } else {
          this._protoDescriptorService.getDescriptorProto(
            tableName,
            url,
          ).then((descriptorProto) => {
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
