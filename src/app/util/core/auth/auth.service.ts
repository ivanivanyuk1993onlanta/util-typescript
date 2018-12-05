import {Injectable} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {StorageWrap} from '../storage/storage';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly isLoggedIn$: Observable<boolean>;
  readonly storage: StorageWrap;
  readonly userName = new FormControl;

  constructor() {
    this.storage = new StorageWrap('auth');

    this.userName.valueChanges.subscribe(
      (userName: string): void => {
        this.storage.set<string>('userName', userName);
      },
    );

    this.isLoggedIn$ = this.userName.valueChanges.pipe(
      map((userName: string): boolean => {
        return userName !== '';
      }),
    );

    this.storage.get<string>('userName').
      then((userName: string): void => {
        this.userName.setValue(userName !== null ? userName : '');
      }).
      catch(() => {
        this.userName.setValue('');
      });
  }

  signIn() {
    this.userName.setValue('ivanivanyuk1993');
  }

  signOut() {
    this.userName.setValue('');
  }
}
