import { Injectable } from '@angular/core';
import {fromEvent} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalClickEventService {
  public readonly globalClickEvent$ = fromEvent<MouseEvent>(document, 'click');
}
