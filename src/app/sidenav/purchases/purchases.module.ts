import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PurchasesRoutingModule} from "./purchases-routing.module";
import {PurchasesComponent} from "./purchases.component";
import {PurchaseService} from "../../services/purchase.service";
import {
  MatButtonModule,
  MatIconModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatTableModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatIconModule,
    FlexLayoutModule,
    PurchasesRoutingModule
  ],
  declarations: [PurchasesComponent],
  providers: [PurchaseService]
})
export class PurchasesModule {
}
