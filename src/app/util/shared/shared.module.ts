import {NgModule} from '@angular/core';
import {FlexSpacerComponent} from './flex-spacer/flex-spacer.component';
import {ProfileMenuModule} from './profile-menu/profile-menu.module';

@NgModule({
  exports: [
    FlexSpacerComponent,
    ProfileMenuModule,
  ],
  imports: [],
  declarations: [FlexSpacerComponent],
})
export class SharedModule {
}
