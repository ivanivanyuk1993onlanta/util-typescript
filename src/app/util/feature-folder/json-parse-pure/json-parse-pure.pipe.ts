import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonParsePure'
})
export class JsonParsePurePipe implements PipeTransform {
  transform(json: string) {
    return JSON.parse(json);
  }
}
