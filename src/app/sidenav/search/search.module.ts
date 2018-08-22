import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchRoutingModule} from "./search-routing.module";
import {SearchComponent} from "./search.component";
import {ArchiveService} from "../../services/archive.service";
import {DatesComponent} from "../../dates/dates.component";
import {MapComponent} from "../../map/map.component";
import {UserModule} from "./user/user.module";
import {MatButtonModule, MatCardModule, MatDividerModule, MatListModule} from "@angular/material";
import {FormsModule} from "@angular/forms";
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {LeafletDrawModule} from "@asymmetrik/ngx-leaflet-draw";
import {MapModule} from "../../map/map.module";
import {DatesModule} from "../../dates/dates.module";

@NgModule({
  imports: [
    CommonModule,
    SearchRoutingModule,
    FormsModule,
    UserModule.forRoot(),
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot(),
    MapModule,
    DatesModule.forRoot(),
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule
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
