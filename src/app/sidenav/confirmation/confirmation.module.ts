import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ConfirmationRoutingModule} from './confirmation-routing.module';
import {ConfirmationComponent} from './confirmation.component';
import {MatButtonModule, MatPaginatorModule, MatProgressSpinnerModule, MatSnackBarModule, MatTableModule} from '@angular/material';
import {RegisterRoutingModule} from '../../register/register-routing.module';
import {DialogModule} from '../../dialogs/dialog.module';

@NgModule({
  imports: [
    CommonModule,
      MatTableModule,
      MatPaginatorModule,
      MatButtonModule,
      MatProgressSpinnerModule,
    ConfirmationRoutingModule,
      RegisterRoutingModule,
      DialogModule, MatSnackBarModule,
  ],
    declarations: [ConfirmationComponent],
    exports: [ConfirmationComponent]
})
export class ConfirmationModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ConfirmationModule
        };
    }
}
