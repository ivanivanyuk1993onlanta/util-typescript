import * as logTypeWithUiPermissionDataProto from './model/proto/log-type/log-type-with-ui-permission-data_pb.js';
import {AuthService} from '../util/service/auth/auth.service';
import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  protoMessage = logTypeWithUiPermissionDataProto.LogTypeWithUiPermissionData;

  constructor(
    public authService: AuthService,
  ) {
  }
}
