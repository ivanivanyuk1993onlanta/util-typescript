import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isNanPure'
})
export class IsNanPurePipe<T> implements PipeTransform {
  transform(value: T): any {
    return isNaN(Number(value));
  }
}
