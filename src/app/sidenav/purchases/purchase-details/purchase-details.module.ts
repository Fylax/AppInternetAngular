import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PurchaseDetailsRoutingModule} from './purchase-details-routing.module';
import {PurchaseDetailsComponent} from "./purchase-details.component";
import {ShareMapInfoService} from "../../../services/share-map-info.service";
import {MatTableModule} from "@angular/material";
import {MapModule} from "../../../map/map.module";

@NgModule({
  imports: [
    CommonModule,
    PurchaseDetailsRoutingModule,
    MapModule,
    MatTableModule
  ],
  declarations: [PurchaseDetailsComponent],
  exports: [PurchaseDetailsComponent]
})
export class PurchaseDetailsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PurchaseDetailsModule,
      providers: [ShareMapInfoService]
    };
  }
}
