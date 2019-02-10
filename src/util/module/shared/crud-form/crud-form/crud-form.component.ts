import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {
  DescriptorProto,
  FileDescriptorProto,
} from 'google-protobuf/google/protobuf/descriptor_pb.js';
import {ProtoDescriptorService} from '../../../../service/proto-descriptor/proto-descriptor.service';

@Component({
  selector: 'app-crud-form',
  templateUrl: './crud-form.component.html',
  styleUrls: ['./crud-form.component.scss'],
})
export class CrudFormComponent implements OnInit {
  @Input() dataUrl: string;
  @Input() protoMessage: any;
  @Input() tableName: string;

  constructor(
    private _formBuilder: FormBuilder,
    private _httpClient: HttpClient,
    private _protoDescriptorService: ProtoDescriptorService,
  ) {
  }

  ngOnInit(): void {
    const promise = this._protoDescriptorService.getDescriptorProto(
      this.tableName,
      this.dataUrl,
    );
    console.log(promise);
    promise.then(result => {
      console.log(result);
    });
    // this._httpClient.
    //   get('http://localhost:8080/ui-permission-data/descriptor-proto', {responseType: 'arraybuffer'}).
    //   toPromise().
    //   then((data) => {
    //     console.log('-');
    //     console.log('-');
    //     console.log(DescriptorProto.deserializeBinary(data));
    //     console.log(DescriptorProto.deserializeBinary(data).getFieldList());
    //     console.log(DescriptorProto.deserializeBinary(data).getFieldList().map((item) => item.toObject()));
    //   });

    // this._httpClient.
    //   get(`${this.dataUrl}?id=1`, {responseType: 'arraybuffer'}).
    //   toPromise().
    //   then((data) => {
    //     console.log('-');
    //     console.log('-');
    //     console.log(this.protoMessage.deserializeBinary(data));
    //     console.log(this.protoMessage.deserializeBinary(data).toObject());
    //   });
  }

}
