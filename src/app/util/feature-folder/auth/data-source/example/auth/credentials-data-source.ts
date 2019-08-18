import {FormControl, FormGroup} from '@angular/forms';
import {CredentialsDataSourceInterface} from '../../credentials-data-source-interface';

export class CredentialsDataSource implements CredentialsDataSourceInterface {
  readonly formGroup = new FormGroup({
    login: new FormControl(),
    password: new FormControl(),
  });

  readonly formFieldDataList = [
    {
      fieldName: 'login',
      label: 'Login',
    },
    {
      fieldName: 'password',
      label: 'Password',
      type: 'password',
    },
  ];
}
