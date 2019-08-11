import {FormControl, FormGroup} from '@angular/forms';
import {CredentialsDataSourceInterface} from '../../util/feature-folder/auth/data-source/credentials-data-source-interface';

export class CredentialsDataSource implements CredentialsDataSourceInterface {
  readonly formGroup = new FormGroup({
    login: new FormControl(),
    password: new FormControl(),
  });

  readonly formFieldDataList = [
    {
      fieldName: 'login',
      label: 'Логин',
    },
    {
      fieldName: 'password',
      label: 'Пароль',
      type: 'password',
    },
  ];
}
