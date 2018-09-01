import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserArchiveRoutingModule} from './user-archive-routing.module';
import {UserArchiveComponent} from './user-archive.component';
import {ArchiveService} from '../../services/archive.service';
import {
  MatButtonModule,
  MatDialogModule, MatListModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatTableModule
} from '@angular/material';
import {DialogComponent} from '../user-archive/dialog/dialog.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule, MatProgressBarModule,
    MatDialogModule, MatListModule,
    FlexLayoutModule, HttpClientModule,
    MatProgressSpinnerModule,
    UserArchiveRoutingModule
  ],
  declarations: [UserArchiveComponent, DialogComponent],
  exports: [UserArchiveComponent],
  entryComponents: [DialogComponent],
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
