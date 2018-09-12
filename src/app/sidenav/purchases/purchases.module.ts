import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PurchasesRoutingModule} from "./purchases-routing.module";
import {PurchasesComponent} from "./purchases.component";
import {PurchaseService} from "../../services/purchase.service";
import {MatButtonModule, MatIconModule, MatPaginatorModule, MatProgressSpinnerModule, MatTableModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SearchModule} from '../search/search.module';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatIconModule,
    FlexLayoutModule,
    SearchModule,
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
