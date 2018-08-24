import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserComponent} from "./user.component";
import {PurchasesComponent} from "../../purchases/purchases.component";
import {AuthenticationGuard} from "../../../app-routing/guards/authentication.guard";

const routes: Routes = [
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthenticationGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
