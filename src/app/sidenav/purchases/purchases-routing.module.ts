import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {PurchasesComponent} from "./purchases.component";
import {AuthenticationGuard} from "../../app-routing/guards/authentication.guard";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PurchasesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasesRoutingModule {
}
