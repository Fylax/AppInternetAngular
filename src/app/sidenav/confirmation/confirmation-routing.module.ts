import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ConfirmationComponent} from "./confirmation.component";
import {AuthenticationGuard} from "../../app-routing/guards/authentication.guard";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ConfirmationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfirmationRoutingModule {
}
