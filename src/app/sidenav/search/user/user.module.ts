import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserRoutingModule} from "./user-routing.module";
import {UserComponent} from "./user.component";
import {ShareMapInfoService} from "../../../services/share-map-info.service";
import {PositionsService} from "../../../services/positions.service";

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule
  ],
  declarations: [UserComponent],
  exports: [UserComponent]
})
export class UserModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: UserModule,
      providers: [
          ShareMapInfoService,
          PositionsService
      ]
    };
  }
}
