import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {LeafletDrawModule} from "@asymmetrik/ngx-leaflet-draw";
import {MapComponent} from "./map.component";
import {MatCardModule} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot(),
    MatCardModule
  ],
  declarations: [MapComponent],
  exports: [MapComponent]
})
export class MapModule {
}
