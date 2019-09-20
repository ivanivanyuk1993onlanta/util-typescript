import {DynamicComponentInterface} from '../../dynamic-container/dynamic-container/dynamic-component-interface';
import {CellComponentInputInterface} from './cell-component-input-interface';

export interface DynamicCellComponentInterface<DataObjectType, TableDataSourceType> extends DynamicComponentInterface<CellComponentInputInterface<DataObjectType, TableDataSourceType>> {
}
