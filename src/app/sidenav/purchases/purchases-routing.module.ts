import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {PurchasesComponent} from "./purchases.component";

const routes: Routes = [
  {
    path: 'purchases',
    component: PurchasesComponent,
    children: [
      {
        path: ':id',
        loadChildren: './purchase-details/purchase-details.module#PurchaseDetailsModule'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasesRoutingModule {
}
