import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {combineLatest, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormService} from '../../../../service/form/form.service';
import {TableUrlService} from '../../../../service/table-url/table-url.service';
import {FormFieldBase} from '../../../../service/form/form-field-base';

@Component({
  selector: 'app-crud-form',
  templateUrl: './crud-form.component.html',
  styleUrls: ['./crud-form.component.scss'],
})
export class CrudFormComponent implements OnInit {
  @Input() protoMessage: any;
  @Input() tableName: string;

  form$: Observable<{
    formFieldList: FormFieldBase<any>[],
    formGroup: FormGroup,
  }>;

  constructor(
    private _formService: FormService,
    private _httpClient: HttpClient,
  ) {
  }

  ngOnInit(): void {
    this.form$ = combineLatest(
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
        ([fieldNumberToFieldDescriptorProtoObjectMap, messageWithUiPermissionDataProto]): any => {
          const formFieldList = FormService.getFormFieldList(
            this.tableName,
            messageWithUiPermissionDataProto,
            fieldNumberToFieldDescriptorProtoObjectMap,
          );
          const formGroup = new FormGroup(formFieldList.reduce((acc, item) => {
            acc[item.fieldNumber] = new FormControl(item.value, Validators.required); // todo load validator data from server api
            return acc;
          }, {}));

          return {
            formFieldList,
            formGroup,
          };
        }),
      startWith({
        formFieldList: [],
        formGroup: new FormGroup({}),
      }),
    );
  }

}
