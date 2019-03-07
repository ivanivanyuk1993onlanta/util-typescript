import {AuthService} from '../../../../service/auth/auth.service';
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {RegisterFormComponent} from '../../register-form/register-form.component';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
})
export class ProfileMenuComponent {

  constructor(
    public authService: AuthService,
    public router: Router,
    private _matDialog: MatDialog,
  ) {
  }

  openDialog() {
    this._matDialog.open(RegisterFormComponent);
  }
}
