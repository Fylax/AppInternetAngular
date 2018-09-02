import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PurchasesRoutingModule} from "./purchases-routing.module";
import {PurchasesComponent} from "./purchases.component";
import {PurchaseService} from "./purchase.service";
import {MatButtonModule, MatPaginatorModule, MatProgressSpinnerModule, MatTableModule} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    PurchasesRoutingModule
  ],
  declarations: [PurchasesComponent],
  exports: [PurchasesComponent]
})
export class PurchasesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PurchasesModule,
      providers: [PurchaseService]
    };
  }
}