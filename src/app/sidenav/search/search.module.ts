import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchRoutingModule} from "./search-routing.module";
import {SearchComponent} from "./search.component";
import {ArchiveService} from "../../services/archive.service";
import {UserModule} from "./user/user.module";
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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UserModule.forRoot(),
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot(),
    MapModule,
    DatesModule.forRoot(),
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    SearchRoutingModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    FlexLayoutModule
  ],
  declarations: [
    SearchComponent
  ],
  exports: [SearchComponent]
})
export class SearchModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SearchModule,
      providers: [ArchiveService]
    };
  }
}
