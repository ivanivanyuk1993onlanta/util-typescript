import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringListGetterService {

  constructor() {
  }

  get(): String[] {
    return [
      'string1',
      'string2',
      'string3',
      'string4',
      'string5',
      'string6',
      'string7',
      'string8',
      'string9',
      'string10',
    ];
  }
}
