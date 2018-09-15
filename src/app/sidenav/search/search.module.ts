import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchRoutingModule} from "./search-routing.module";
import {SearchComponent} from "./search.component";
import {ArchiveService} from "../../services/archive.service";
import {
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatExpansionModule,
  MatListModule,
  MatProgressSpinnerModule
} from '@angular/material';
import {FormsModule} from "@angular/forms";
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {LeafletDrawModule} from "@asymmetrik/ngx-leaflet-draw";
import {MapModule} from "../../map/map.module";
import {DatesModule} from "../../dates/dates.module";
import {FlexLayoutModule} from '@angular/flex-layout';
import {ShareMapInfoService} from "../../services/share-map-info.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot(),
    MapModule,
    DatesModule.forChild(),
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    SearchRoutingModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    FlexLayoutModule
  ],
  providers: [
    ShareMapInfoService
  ],
  declarations: [SearchComponent]
})
export class SearchModule {
}
