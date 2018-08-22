import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidenavComponent} from "./sidenav.component";
import {SidenavRoutingModule} from "./sidenav-routing.module";
import {SearchModule} from "./search/search.module";
import {PurchasesModule} from "./purchases/purchases.module";
import {UserArchiveModule} from "./user-archive/user-archive.module";
import {MatIconModule, MatListModule, MatSidenavModule, MatToolbarModule} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    SidenavRoutingModule,
    SearchModule.forRoot(),
    PurchasesModule.forRoot(),
    UserArchiveModule.forRoot(),
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule
  ],
  declarations: [SidenavComponent],
  exports: [SidenavComponent]
})
export class SidenavModule {
}
