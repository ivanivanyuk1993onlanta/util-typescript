import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {RouteListDataSourceInterface} from '../data-source/route-list-data-source-interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-list-item',
  styleUrls: ['./route-list-item.component.scss'],
  templateUrl: './route-list-item.component.html',
})
export class RouteListItemComponent<DataObjectType> {
  @Input() dataObject: DataObjectType;
  @Input() dataSource: RouteListDataSourceInterface<DataObjectType>;
}
