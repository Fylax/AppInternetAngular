import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DatesComponent} from "./dates.component";
import {DatesService} from "./dates.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  MAT_DATE_LOCALE,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule
} from '@angular/material';
import {MatMomentDateModule} from '@angular/material-moment-adapter';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
      MatNativeDateModule,
      MatMomentDateModule,
    MatInputModule
  ],
  declarations: [DatesComponent],
  exports: [DatesComponent]
})
export class DatesModule {
  static forChild(): ModuleWithProviders {
    return {
      ngModule: DatesModule,
      providers: [
        DatesService,
        {
          provide: MAT_DATE_LOCALE,
          useValue: 'it-IT'
        }
      ]
    };
  }
}
