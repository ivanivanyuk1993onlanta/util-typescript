import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import {RouteData} from '../../../class-folder/route/route-data';

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

  ngAfterViewInit(): void {
    this.routeData.textTranslatedSubject$.next(
      this.translationElement.nativeElement.textContent,
    );
  }

}
