import {ChangeDetectionStrategy, Component} from '@angular/core';
import {LocalizationService} from '../localization/localization.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-locale-selection',
  styleUrls: ['./locale-selection.component.scss'],
  templateUrl: './locale-selection.component.html',
})
export class LocaleSelectionComponent {
  constructor(
    public localizationService: LocalizationService,
  ) {
  }

  public setLocale(
    locale: string
  ) {
    this.localizationService.localizationDataSource.setLocale$(locale).subscribe();
  }
}
