import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SidenavComponent} from "./sidenav.component";
import {SidenavRoutingModule} from "./sidenav-routing.module";
import {SearchModule} from "./search/search.module";
import {PurchasesModule} from "./purchases/purchases.module";
import {UserArchiveModule} from "./user-archive/user-archive.module";
import {MatButtonModule, MatIconModule, MatSidenavModule, MatToolbarModule, MatDividerModule} from "@angular/material";
import {ConfirmationModule} from './confirmation/confirmation.module';
import {ArchiveService} from '../services/archive.service';

@NgModule({
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatDividerModule,
    SearchModule,
    PurchasesModule,
    UserArchiveModule,
    ConfirmationModule,
    SidenavRoutingModule
  ],
  providers: [ArchiveService],
  declarations: [SidenavComponent]
})
export class SidenavModule  {
}
