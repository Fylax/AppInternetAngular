import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ErrorRoutingModule} from "./error-routing.module";
import {ErrorComponent} from "./error.component";
import {MatButtonModule} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    ErrorRoutingModule
  ],
  declarations: [ErrorComponent],
  exports: [ErrorComponent],
})
export class ErrorModule {
}
