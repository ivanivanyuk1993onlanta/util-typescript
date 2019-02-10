import {NgModule} from '@angular/core';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatOptionModule,
  MatSidenavModule,
  MatToolbarModule,
} from '@angular/material';

@NgModule({
  exports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatOptionModule,
    MatSidenavModule,
    MatToolbarModule,
  ],
})
export class MaterialUsedModule {
}
