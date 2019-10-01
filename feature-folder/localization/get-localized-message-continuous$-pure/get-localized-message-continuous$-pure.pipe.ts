import {Pipe, PipeTransform} from '@angular/core';
import {LocalizationService} from '../localization/localization.service';

@Pipe({
  name: 'getLocalizedMessageContinuous$Pure'
})
export class GetLocalizedMessageContinuous$PurePipe implements PipeTransform {
  constructor(
    private _localizationService: LocalizationService,
  ) {
  }

  transform(messageCode: string): any {
    return this._localizationService.localizationDataSource.getLocalizedMessageContinuous$(messageCode);
  }

}
