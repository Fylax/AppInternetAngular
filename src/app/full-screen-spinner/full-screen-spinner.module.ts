import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatProgressSpinnerModule} from "@angular/material";
import {FullScreenSpinnerComponent} from "./full-screen-spinner.component";
import {FullScreenSpinnerService} from "./full-screen-spinner.service";

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  declarations: [FullScreenSpinnerComponent],
  exports: [FullScreenSpinnerComponent]
})
export class FullScreenSpinnerModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FullScreenSpinnerModule,
      providers: [
        FullScreenSpinnerService
      ]
    };
  }
}
