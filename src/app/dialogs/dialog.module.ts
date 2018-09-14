import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DeleteDialogComponent} from './delete-dialog/delete-dialog.component';
import {MatButtonModule, MatDialogModule, MatProgressBarModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressBarModule,
    MatDialogModule,
    FlexLayoutModule
  ],
  declarations: [DeleteDialogComponent],
  exports: [DeleteDialogComponent]
})
export class DialogModule { }
