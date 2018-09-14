import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfirmationRoutingModule} from './confirmation-routing.module';
import {ConfirmationComponent} from './confirmation.component';
import {MatButtonModule, MatCardModule, MatSnackBarModule, MatTableModule} from '@angular/material';
import {DialogModule} from '../../dialogs/dialog.module';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    ConfirmationRoutingModule,
    FlexLayoutModule,
    MatCardModule,
    DialogModule,
    MatSnackBarModule,
  ],
  declarations: [ConfirmationComponent]
})
export class ConfirmationModule {
}
