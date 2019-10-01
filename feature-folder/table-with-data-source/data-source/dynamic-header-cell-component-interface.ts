import {DynamicComponentInterface} from '../../dynamic-container/dynamic-container/dynamic-component-interface';
import {HeaderCellComponentInputInterface} from './header-cell-component-input-interface';

export interface DynamicHeaderCellComponentInterface<TableDataSourceType> extends DynamicComponentInterface<HeaderCellComponentInputInterface<TableDataSourceType>> {
}
