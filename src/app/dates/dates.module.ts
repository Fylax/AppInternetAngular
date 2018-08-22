import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DatesComponent} from "./dates.component";
import {DatesService} from "./dates.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MAT_DATE_LOCALE, MatDatepickerModule, MatFormFieldModule, MatInputModule} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule
  ],
  declarations: [DatesComponent],
  exports: [DatesComponent]
})
export class DatesModule {
  static forRoot(): ModuleWithProviders {
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
