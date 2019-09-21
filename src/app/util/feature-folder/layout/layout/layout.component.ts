import {ChangeDetectionStrategy, Component, Input, TemplateRef} from '@angular/core';
import {MediaQueryObserverService} from '../../media-query-observer/media-query-observer.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-layout',
  styleUrls: ['./layout.component.scss'],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  @Input() contentTemplateRef: TemplateRef<any>;
  @Input() headerTemplateRef: TemplateRef<any>;
  @Input() sidenavTemplateRef: TemplateRef<any>;

  constructor(
    public mediaQueryObserverService: MediaQueryObserverService,
  ) {
  }

}
