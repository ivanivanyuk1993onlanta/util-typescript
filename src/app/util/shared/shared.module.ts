import {NgModule} from '@angular/core';
import {MatListItem, MatListModule, MatNavList} from '@angular/material';

@NgModule({
  exports: [
    MatListItem,
    MatNavList,
  ],
  imports: [
    MatListModule,
  ],
})
export class SharedModule {
}
