import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {RegisterComponent} from "./register.component";
import {RegisterService} from "./register.service";
import {RegisterRoutingModule} from "./register-routing.module";

import {FlexLayoutModule} from '@angular/flex-layout';

import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from '@angular/material/button';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    RegisterRoutingModule
  ],
  declarations: [RegisterComponent],
  providers: [RegisterService]
})
export class RegisterModule {
}
