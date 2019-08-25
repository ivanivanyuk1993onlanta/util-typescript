import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {DynamicComponentInterface} from '../../../../dynamic-container/dynamic-container/dynamic-component-interface';
import {HeaderCellComponentInputInterface} from '../../header-cell-component-input-interface';
import {HeaderCellDataSourceExample} from '../header-cell-data-source-example';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header-cell-example',
  styleUrls: ['./header-cell-example.component.scss'],
  templateUrl: './header-cell-example.component.html',
})
export class HeaderCellExampleComponent<CellDataSourceType, ColumnDescriptionType, DataObjectType> implements DynamicComponentInterface<HeaderCellComponentInputInterface<CellDataSourceType, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceExample>>, OnChanges {
  // tslint:disable-next-line:max-line-length
  @Input() input: HeaderCellComponentInputInterface<CellDataSourceType, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceExample>;

  public ngOnChanges(changes: SimpleChanges): void {
  }
}
