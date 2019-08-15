import { GetLocalizedMessageContinuous$PurePipe } from './get-localized-message-continuous$-pure.pipe';
import {inject} from '@angular/core';
import {LocalizationService} from '../localization/localization.service';

describe('GetLocalizedMessageContinuous$PurePipe', () => {
  it('create an instance', () => {
    const pipe = new GetLocalizedMessageContinuous$PurePipe(inject(LocalizationService));
    expect(pipe).toBeTruthy();
  });
});
