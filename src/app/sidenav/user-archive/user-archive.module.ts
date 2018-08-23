import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserArchiveRoutingModule} from './user-archive-routing.module';
import {UserArchiveComponent} from "./user-archive.component";
import {ArchiveService} from "../../services/archive.service";
import {MatPaginatorModule, MatProgressSpinnerModule, MatTableModule} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    UserArchiveRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  declarations: [UserArchiveComponent],
  exports: [UserArchiveComponent]
})
export class UserArchiveModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: UserArchiveModule,
      providers: [
        ArchiveService
      ]
    };
  }
}
