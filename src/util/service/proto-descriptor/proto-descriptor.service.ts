import {Injectable} from '@angular/core';
import {StorageWrap} from '../../class/storage/storage';
import {DescriptorProto} from 'google-protobuf/google/protobuf/descriptor_pb';
import {HttpClient} from '@angular/common/http';
import {ResolvablePromise} from '../../class/resolvable-promise/resolvable-promise';

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

  getDescriptorProto(
    tableName: string,
    url: string,
  ): Promise<any> {
    const resolvablePromise = new ResolvablePromise<any>();

    this._descriptorProtoStorage.get(tableName).
      then((descriptorProtoArray) => {
        if (descriptorProtoArray != null) {
          resolvablePromise.resolve(new DescriptorProto(descriptorProtoArray));
        } else {
          this._httpClient.
            get(`${url}/descriptor-proto`, {responseType: 'arraybuffer'}).
            toPromise().
            then((descriptorProtoBytes) => {
              const descriptorProto = DescriptorProto.deserializeBinary(
                descriptorProtoBytes,
              );

              this._descriptorProtoStorage.set(
                tableName,
                descriptorProto.toArray(),
              ).then(() => {
                resolvablePromise.resolve(descriptorProto);
              });
            });
        }
      });

    return resolvablePromise.promise;
  }
}
