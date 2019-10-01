import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapGetPure'
})
export class MapGetPurePipe<K, V> implements PipeTransform {
  transform(
    map: Map<K, V>,
    key: K,
  ): V {
    return map.get(key);
  }
}
