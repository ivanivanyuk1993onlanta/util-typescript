import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import {RouteData} from '../../../core/route/route-data';

@Component({
  selector: 'app-route-translation',
  templateUrl: './route-translation.component.html',
  styleUrls: ['./route-translation.component.scss'],
})
export class RouteTranslationComponent implements AfterViewInit {
  @Input() routeData: RouteData;

  @ViewChild(
    'translationElement',
    {read: ElementRef},
  ) translationElement: ElementRef;

  constructor() {
  }

  ngAfterViewInit(): void {
    this.routeData.textTranslated = this.translationElement.nativeElement.textContent;
  }

}
