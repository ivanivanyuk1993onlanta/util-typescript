import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges, TrackByFunction
} from '@angular/core';
import {OptimisedForDataListSelectionDataSource} from '../../selection-data-source/implementation/optimised-for-data-list-selection-data-source';
import {filter, first, mergeMap, takeUntil, tap, withLatestFrom} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {TableDataSourceInterface} from '../data-source/table-data-source-interface';
import {DynamicCellComponentInterface} from '../data-source/dynamic-cell-component-interface';
import {DynamicHeaderCellComponentInterface} from '../data-source/dynamic-header-cell-component-interface';
import {Broadcaster} from '../../../util-typescript/broadcaster/broadcaster';
import {getSharedObservableWithLastValue} from '../../../util-typescript/get-shared-observable-with-last-value/get-shared-observable-with-last-value';
import {CdkDragDrop} from '@angular/cdk/drag-drop';

// todo ASAP(why - because apps require too many tables, the sooner it will be done - the better) this component is
//  still in progress of active development/accumulating usage data. On this moment it is expected to be removed, as
//  it's usage proved to be limiting/inconvenient
//  What it should be replaced with:
//  - selection logic should be moved to reusable TableSelectionDataSource, which should be used like
//  this.tableSelectionDataSource = new TableSelectionDataSource(this) inside TableDataSource implementation
//  - same should happen for drag/drop logic, notice that drag drop may happen in tree table, so there should be
//  TableDragDropDataSource variants for both flat and tree table
//  - most common table row definitions should be moved to reusable templates/components (for example row
//  definition(*matRowDef) with selection and drag-drop, which should notify TableDataSource about click event and apply
//  selected (or maybe css class 'selected' should be applied in getRowNgClassContinuous$))
//  - About table in template - I believe every table should have trackBy func, hence this logic is a candidate to be
//  reusable, together with this line [dataSource]="dataSource | getDataListContinuous$Pure". The only thing that may
//  change among different tables is cdkDropList and (cdkDropListDropped)="cdkDropListDropped($event)", hence maybe
//  there should be a component that will take as input dataSource and it's colDef/rowDef ng-template, which will decide,
//  depending on some method in dataSource, whether it should use cdkDropList directive/listener/cdkDropListConnectedTo.
//  I forgot that it also has to apply multiTemplateDataRows
//  - row definition templates should be passed either as array of ng-templates and getColumnCodeList by their index, or
//  as one ng-template with columnCode list decided in template (smells, but it eases row communication (otherwise the
//  only way will be through data source))(have to make decision here, for now I am strongly for getColumnCodeList by
//  their index)
//  - column defs may be passed all inside one ng-template, as they do not need different column code lists

// todo Described above changes will allow to build tables of any complexity(like tree tables), without much copy-paste

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-table-with-data-source',
  styleUrls: ['./table-with-data-source.component.scss'],
  templateUrl: './table-with-data-source.component.html',
})
export class TableWithDataSourceComponent<CellComponentType extends DynamicCellComponentInterface<DataObjectType,
  TableDataSourceType>,
  HeaderCellComponentType extends DynamicHeaderCellComponentInterface<TableDataSourceType>,
  TableDataSourceType extends TableDataSourceInterface<CellComponentType,
    HeaderCellComponentType,
    TableDataSourceType,
    DataObjectType,
    KeyType>,
  DataObjectType = any,
  KeyType = any> implements OnChanges, OnDestroy {
  @Input() dataSource: TableDataSourceType;
  @Output() rowDoubleClick = new EventEmitter<DataObjectType>();

  keySelectionDataSourceContinuous$: Observable<OptimisedForDataListSelectionDataSource<KeyType>>;
  trackByFunc: TrackByFunction<DataObjectType>;

  private _changeBroadcaster = new Broadcaster();
  private _keyListContinuous$: Observable<KeyType[]>;
  private _keySelectionDataSourceBS$ = new BehaviorSubject<OptimisedForDataListSelectionDataSource<KeyType>>(null);
  private _keyToRowIndexMapBS$ = new BehaviorSubject(new Map<KeyType, number>());
  private _lastClickedWithoutShiftKeyBS$ = new BehaviorSubject<KeyType>(null);

  constructor() {
    this.keySelectionDataSourceContinuous$ = getSharedObservableWithLastValue(
      this._keySelectionDataSourceBS$.pipe(
        filter(x => !!x),
      ),
    );
  }

  public cdkDropListDropped(event: CdkDragDrop<DataObjectType>) {
    this.dataSource.dragItem$(event).pipe(
      takeUntil(this._changeBroadcaster.broadcastS$),
    ).subscribe();
  }

  public handleRowClick(
    row: DataObjectType,
    event: MouseEvent,
  ) {
    // Cleaning selection if shift key is pressed
    if (event.shiftKey) {
      window.getSelection().empty();
    }

    this.dataSource.getKeyContinuous$(row).pipe(
      withLatestFrom(this.keySelectionDataSourceContinuous$),
      first(),
      tap(([clickedKey, keySelectionDataSource]) => {
        const selectionModel = keySelectionDataSource.selectionModel;

        const lastClickedWithoutShiftKeyBS$ = this._lastClickedWithoutShiftKeyBS$;
        if (event.shiftKey) {
          if (!event.ctrlKey) {
            // Если не нажат Ctrl, мы можем очистить выделение
            selectionModel.clear();
          }

          const lastClickedWithoutShiftKey = lastClickedWithoutShiftKeyBS$.getValue();
          // Если мы ещё не кликали без Shift, ничего делать не нужно
          if (lastClickedWithoutShiftKey) {
            this._selectRange(clickedKey, lastClickedWithoutShiftKey);
          }
        } else {
          // Мы кликнули без Shift, записываем
          lastClickedWithoutShiftKeyBS$.next(clickedKey);

          if (!event.ctrlKey) {
            // При клике по выделенной строке в режиме единичного выделения нужно снять с неё выделение, если она одна,
            // потому что если она не одна, нужно будет её выделить. Для этого пишем флаг
            const shouldDeselectClickedKey = selectionModel.isSelected(clickedKey) && selectionModel.selected.length === 1;
            // Если не нажат Ctrl, то у нас режим единичного выделения, нужно очистить старое
            selectionModel.clear();
            if (shouldDeselectClickedKey) {
              selectionModel.toggle(clickedKey);
            }
          }
          selectionModel.toggle(clickedKey);
        }
      }),
      takeUntil(this._changeBroadcaster.broadcastS$),
    ).subscribe();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this._changeBroadcaster.broadcast();

    if (this.dataSource) {
      this.trackByFunc = (index, item) => this.dataSource.trackByFunc(index, item);

      this._keyListContinuous$ = getSharedObservableWithLastValue(
        this.dataSource.getDataListContinuous$().pipe(
          mergeMap(dataList => this.dataSource.getKeyListContinuous$(dataList)),
          tap(keyList => {
            // Строим здесь map за O(n), чтобы не тратить O(n) при каждом вызове _getRowIndexByKey
            this._keyToRowIndexMapBS$.next(
              new Map<KeyType, number>(keyList.map((key, index) => {
                return [
                  key,
                  index,
                ];
              })),
            );

            // Обнуляем lastClickedWithoutShiftKey, если такого ключа больше нет
            if (!this._keyToRowIndexMapBS$.getValue().has(this._lastClickedWithoutShiftKeyBS$.getValue())) {
              this._lastClickedWithoutShiftKeyBS$.next(null);
            }
          }),
        ),
      );

      this._keySelectionDataSourceBS$.next(
        new OptimisedForDataListSelectionDataSource(this._keyListContinuous$, this._changeBroadcaster.broadcastS$),
      );
    }
  }

  public ngOnDestroy(): void {
    this._changeBroadcaster.broadcastAndComplete();
  }

  private _selectRange(
    clickedKey: KeyType,
    lastClickedWithoutShiftKey: KeyType,
  ) {
    this._keyListContinuous$.pipe(
      withLatestFrom(this.keySelectionDataSourceContinuous$),
      first(),
      tap(([keyList, keySelectionDataSource]) => {
        // Получаем индексы последеней кликнутой без Shift строки и кликнутой сейчас строки
        const clickedKeyIndex = this._keyToRowIndexMapBS$.getValue().get(clickedKey);
        const lastClickedWithoutShiftKeyIndex = this._keyToRowIndexMapBS$.getValue().get(lastClickedWithoutShiftKey);

        // Вычисляем младший и старший индексы
        let leftIndex: number;
        let rightIndex: number;
        if (clickedKeyIndex < lastClickedWithoutShiftKeyIndex) {
          leftIndex = clickedKeyIndex;
          rightIndex = lastClickedWithoutShiftKeyIndex;
        } else {
          leftIndex = lastClickedWithoutShiftKeyIndex;
          rightIndex = clickedKeyIndex;
        }

        // Выделяем ключи от младшего до старшего индекса
        keySelectionDataSource.selectionModel.select(...keyList.slice(leftIndex, rightIndex + 1));
      }),
      takeUntil(this._changeBroadcaster.broadcastS$),
    ).subscribe();
  }
}
