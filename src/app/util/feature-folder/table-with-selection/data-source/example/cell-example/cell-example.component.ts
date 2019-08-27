import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {DynamicComponentInterface} from '../../../../dynamic-container/dynamic-container/dynamic-component-interface';
import {CellComponentInputInterface} from '../../cell-component-input-interface';
import {CellDataSourceExample} from '../cell-data-source-example';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cell-component-example',
  styleUrls: ['./cell-example.component.scss'],
  templateUrl: './cell-example.component.html',
})
export class CellExampleComponent<ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType, KeyType> implements DynamicComponentInterface<CellComponentInputInterface<CellDataSourceExample, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType, KeyType>>, OnChanges {
  // tslint:disable-next-line:max-line-length
  @Input() input: CellComponentInputInterface<CellDataSourceExample, ColumnDescriptionType, DataObjectType, HeaderCellDataSourceType, KeyType>;

  public ngOnChanges(changes: SimpleChanges): void {
  }
}
