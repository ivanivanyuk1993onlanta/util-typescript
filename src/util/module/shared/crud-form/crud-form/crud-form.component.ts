import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {combineLatest, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormService} from '../../../../service/form/form.service';
import {TableUrlService} from '../../../../service/table-url/table-url.service';

@Component({
  selector: 'app-crud-form',
  templateUrl: './crud-form.component.html',
  styleUrls: ['./crud-form.component.scss'],
})
export class CrudFormComponent implements OnInit {
  @Input() protoMessage: any;
  @Input() tableName: string;

  formGroup$: Observable<FormGroup>;

  constructor(
    private _formBuilder: FormBuilder,
    private _formService: FormService,
    private _httpClient: HttpClient,
  ) {
  }

  ngOnInit(): void {
    this.formGroup$ = combineLatest(
      this._formService.getFieldNumberToFieldDescriptorProtoObjectMapPromise(
        this.tableName,
      ),
      this._httpClient.get(
        `${TableUrlService.getTableUrl(this.tableName)}?id=1`,
        {responseType: 'arraybuffer'},
      ).pipe(
        map((dataBytes) => {
          return this.protoMessage.deserializeBinary(dataBytes);
        }),
      ),
    ).pipe(
      map(
        ([fieldNumberToFieldDescriptorProtoObjectMap, messageWithUiPermissionDataProto]): FormGroup => {
          console.log(FormService.getFormFieldList(
            messageWithUiPermissionDataProto,
            fieldNumberToFieldDescriptorProtoObjectMap,
          ));
          console.log(messageWithUiPermissionDataProto.getUiPermissionData().
            getPermittedToReadFieldNumberListList());
          console.log(messageWithUiPermissionDataProto);
          return this._formBuilder.group({
            asd: [''],
          });
        }),
      startWith(new FormGroup({})),
    );
  }

}
