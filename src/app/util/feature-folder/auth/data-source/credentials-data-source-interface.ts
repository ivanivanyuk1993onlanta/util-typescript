import {FormGroup} from '@angular/forms';
import {FieldDataInterface} from './field-data-interface';

export interface CredentialsDataSourceInterface {
  readonly formGroup: FormGroup;
  readonly formFieldDataList: Array<FieldDataInterface>;
}
