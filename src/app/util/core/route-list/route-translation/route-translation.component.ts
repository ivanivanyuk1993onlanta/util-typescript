import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-route-translation',
  templateUrl: './route-translation.component.html',
  styleUrls: ['./route-translation.component.scss'],
})
export class RouteTranslationComponent implements AfterViewInit {
  @Input() langKey: string;
  @ViewChild(
    'translationElement',
    {read: ElementRef},
  ) translationElement: ElementRef;
  public translatedText = '';

  constructor() {
  }

  ngAfterViewInit(): void {
    this.translatedText = this.translationElement.nativeElement.textContent;
  }

}
