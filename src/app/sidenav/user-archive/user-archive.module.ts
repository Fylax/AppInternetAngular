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
  MatTableModule,
  MatIconModule, MatSnackBarModule
} from '@angular/material';

import {FlexLayoutModule} from '@angular/flex-layout';
import {HttpClientModule} from '@angular/common/http';
import {DialogComponent} from './dialog/dialog.component';
import {DeleteDialogComponent} from '../../dialogs/delete-dialog/delete-dialog.component';
import {DialogModule} from '../../dialogs/dialog.module';
import {FullScreenSpinnerModule} from '../../full-screen-spinner/full-screen-spinner.module';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule, MatProgressBarModule,
    MatDialogModule, MatListModule,
    FlexLayoutModule, HttpClientModule,
    MatProgressSpinnerModule, MatIconModule,
    UserArchiveRoutingModule,
    DialogModule, MatSnackBarModule,
  ],
  declarations: [UserArchiveComponent, DialogComponent],
  exports: [UserArchiveComponent],
  entryComponents: [DialogComponent, DeleteDialogComponent],
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
