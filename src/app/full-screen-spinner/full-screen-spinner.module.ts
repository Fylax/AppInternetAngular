import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatProgressSpinnerModule} from "@angular/material";
import {FullScreenSpinnerComponent} from "./full-screen-spinner.component";

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  declarations: [FullScreenSpinnerComponent],
  exports: [FullScreenSpinnerComponent]
})
export class FullScreenSpinnerModule {
}
