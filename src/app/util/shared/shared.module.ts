import {NgModule} from '@angular/core';
import {FlexSpacerComponent} from './flex-spacer/flex-spacer.component';
import {ProfileMenuModule} from './profile-menu/profile-menu.module';
import {RouteListModule} from './route-list/route-list.module';

@NgModule({
  exports: [
    FlexSpacerComponent,
    ProfileMenuModule,
    RouteListModule,
  ],
  imports: [],
  declarations: [
    FlexSpacerComponent,
  ],
})
export class SharedModule {
}
