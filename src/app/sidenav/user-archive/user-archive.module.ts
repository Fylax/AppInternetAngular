import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserArchiveRoutingModule} from './user-archive-routing.module';
import {UserArchiveComponent} from './user-archive.component';
import {ArchiveService} from '../../services/archive.service';
import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatListModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatTableModule
} from '@angular/material';

import {FlexLayoutModule} from '@angular/flex-layout';
import {HttpClientModule} from '@angular/common/http';
import {DeleteDialogComponent} from '../../dialogs/delete-dialog/delete-dialog.component';
import {DialogModule} from '../../dialogs/dialog.module';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDialogModule, MatListModule,
    FlexLayoutModule, HttpClientModule,
    MatProgressSpinnerModule, MatIconModule,
    UserArchiveRoutingModule,
    DialogModule, MatSnackBarModule,
  ],
  providers: [ArchiveService],
  declarations: [UserArchiveComponent],
  entryComponents: [DeleteDialogComponent],
})
export class UserArchiveModule {
}
