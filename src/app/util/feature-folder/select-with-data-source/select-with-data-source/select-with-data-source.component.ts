import {ChangeDetectionStrategy, Component, Input, OnDestroy} from '@angular/core';
import {SelectDataSourceInterface} from '../data-source/select-data-source-interface';
import {MatSelectChange} from '@angular/material';
import {takeUntil} from 'rxjs/operators';
import {Broadcaster} from '../../../class-folder/broadcaster/broadcaster';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-select-with-data-source',
  styleUrls: ['./select-with-data-source.component.scss'],
  templateUrl: './select-with-data-source.component.html',
})
export class SelectWithDataSourceComponent<ValueType> implements OnDestroy {
  @Input() dataSource: SelectDataSourceInterface<ValueType>;

  private _changeBroadcaster = new Broadcaster();

  ngOnDestroy(): void {
    this._changeBroadcaster.broadcastAndComplete();
  }

  public select(matSelectChange: MatSelectChange) {
    this.dataSource.setValue$(matSelectChange.value).pipe(
      takeUntil(this._changeBroadcaster.broadcastS$),
    ).subscribe();
  }
}
