import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RegisterComponent} from "./register.component";
import {LoginGuard} from "../app-routing/guards/authentication.guard";

const routes: Routes = [
  {path: 'register', component: RegisterComponent, canActivate: [LoginGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule {
}
