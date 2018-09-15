import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {PurchasesComponent} from "./purchases.component";
import {AuthenticationGuard} from "../../app-routing/guards/authentication.guard";

const routes: Routes = [
  {
    path: '',
    component: PurchasesComponent,
    outlet: 'content'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasesRoutingModule {
}
