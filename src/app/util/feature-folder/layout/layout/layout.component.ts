import {ChangeDetectionStrategy, Component, Input, TemplateRef, ViewChild} from '@angular/core';
import {MediaQueryObserverService} from '../../media-query-observer/media-query-observer.service';
import {MatSidenav} from '@angular/material';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-layout',
  styleUrls: ['./layout.component.scss'],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  @Input() contentTemplateRef: TemplateRef<any>;
  @Input() headerTemplateRef: TemplateRef<any>;
  @Input() leftSidenavTemplateRef: TemplateRef<any>;
  @Input() rightSidenavTemplateRef: TemplateRef<any>;
  @ViewChild('leftSidenav', {static: true}) leftSidenav: MatSidenav;
  @ViewChild('rightSidenav', {static: true}) rightSidenav: MatSidenav;

  constructor(
    public mediaQueryObserverService: MediaQueryObserverService,
  ) {
  }

}
