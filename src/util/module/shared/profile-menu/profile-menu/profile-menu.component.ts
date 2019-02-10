import {AuthService} from '../../../../service/auth/auth.service';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
})
export class ProfileMenuComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public router: Router,
  ) {
  }

  ngOnInit() {
  }

}
