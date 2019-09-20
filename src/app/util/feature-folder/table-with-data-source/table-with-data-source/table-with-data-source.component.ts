import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import {OptimisedForDataListSelectionDataSource} from '../../selection-data-source/implementation/optimised-for-data-list-selection-data-source';
import {filter, first, mergeMap, takeUntil, tap, withLatestFrom} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {TableDataSourceInterface} from '../data-source/table-data-source-interface';
import {DynamicCellComponentInterface} from '../data-source/dynamic-cell-component-interface';
import {DynamicHeaderCellComponentInterface} from '../data-source/dynamic-header-cell-component-interface';
import {Broadcaster} from '../../../class-folder/broadcaster/broadcaster';
import {getSharedObservableWithLastValue} from '../../../method-folder/get-shared-observable-with-last-value/get-shared-observable-with-last-value';
import {CdkDragDrop} from '@angular/cdk/drag-drop';

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

  public keySelectionDataSourceContinuous$: Observable<OptimisedForDataListSelectionDataSource<KeyType>>;

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
