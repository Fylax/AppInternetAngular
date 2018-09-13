import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ConfirmationComponent} from "./confirmation.component";
import {AuthenticationGuard} from "../../app-routing/guards/authentication.guard";

const routes: Routes = [
  {
    path: 'confirmation',
    component: ConfirmationComponent,
    canActivate: [AuthenticationGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfirmationRoutingModule {
}
