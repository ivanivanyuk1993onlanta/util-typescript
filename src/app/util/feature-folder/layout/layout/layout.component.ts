import {Component} from '@angular/core';
import {MediaQueryObserverService} from '../../media-query-observer/media-query-observer.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  constructor(
    public mediaQueryObserverService: MediaQueryObserverService,
  ) {
  }

}
