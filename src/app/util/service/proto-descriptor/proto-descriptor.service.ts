import {Injectable} from '@angular/core';
import {StorageWrap} from '../../class-folder/storage/storage';
import {DescriptorProto} from 'google-protobuf/google/protobuf/descriptor_pb';
import {HttpClient} from '@angular/common/http';
import {ResolvablePromise} from '../../class-folder/resolvable-promise/resolvable-promise';
import {TableService} from '../table/table.service';

@Injectable({
  providedIn: 'root',
})
export class ProtoDescriptorService {
  private _descriptorProtoStorage: StorageWrap;

  constructor(
    private _httpClient: HttpClient,
  ) {
    this._descriptorProtoStorage = new StorageWrap('descriptor-proto');
  }

  public static getTableDescriptorProtoUrl(
    tableName: string,
  ): string {
    return `${TableService.getTableUrl(tableName)}/descriptor-proto`;
  }

  getDescriptorProto(
    tableName: string,
  ): Promise<any> {
    const descriptorProtoPromise = new ResolvablePromise<any>();

    this._descriptorProtoStorage.get(tableName).
      then((descriptorProtoArray) => {
        if (descriptorProtoArray !== null) {
          descriptorProtoPromise.resolve(
            new DescriptorProto(descriptorProtoArray));
        } else {
          this._httpClient.
            get(
              ProtoDescriptorService.getTableDescriptorProtoUrl(tableName),
              {responseType: 'arraybuffer'},
            ).
            toPromise().
            then((descriptorProtoBytes) => {
              const descriptorProto = DescriptorProto.deserializeBinary(
                descriptorProtoBytes,
              );

              this._descriptorProtoStorage.set(
                tableName,
                descriptorProto.toArray(),
              ).then(() => {
                descriptorProtoPromise.resolve(descriptorProto);
              });
            });
        }
      });

    return descriptorProtoPromise.promise;
  }
}
