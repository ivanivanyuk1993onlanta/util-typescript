import {Observable} from 'rxjs';
import {TypeOfNgClass} from '../../table-with-data-source/data-source/type-of-ng-class';
import {ThemePalette} from '@angular/material';

export interface LayoutDataSourceInterface {
  getMatToolBarColorContinuous$?(): Observable<ThemePalette>;

  getSideNavContainerNgClassContinuous$?(): Observable<TypeOfNgClass>;
}
