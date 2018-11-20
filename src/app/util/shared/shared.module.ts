import {FlexSpacerComponent} from './flex-spacer/flex-spacer.component';
import {MaterialUsedModule} from './material-used/material-used.module';
import {NgModule} from '@angular/core';
import {ProfileMenuModule} from './profile-menu/profile-menu.module';
import {RouteListModule} from './route-list/route-list.module';

@NgModule({
  exports: [
    FlexSpacerComponent,
    MaterialUsedModule,
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
