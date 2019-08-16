import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MediaQueryObserverService} from '../../media-query-observer/media-query-observer.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-layout',
  styleUrls: ['./layout.component.scss'],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  constructor(
    public mediaQueryObserverService: MediaQueryObserverService,
  ) {
  }

}
