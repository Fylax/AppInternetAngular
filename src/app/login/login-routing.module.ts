import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from "./login.component";
import {LoginGuard} from "../app-routing/guards/authentication.guard";

const routes: Routes = [
  {
      path: 'login',
      component: LoginComponent,
      canActivate: [LoginGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {
}
