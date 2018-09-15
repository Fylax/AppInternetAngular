import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SidenavComponent} from "./sidenav.component";
import {AuthenticationGuard} from "../app-routing/guards/authentication.guard";

const routes: Routes = [
  {
    path: '',
    component: SidenavComponent,
    children: [
      {
        path: '',
        canLoad: [AuthenticationGuard],
        loadChildren: './search/search.module#SearchModule',
      },
      {
        path: 'search',
        canLoad: [AuthenticationGuard],
        loadChildren: './search/search.module#SearchModule',
      },
      {
        path: 'purchases',
        canLoad: [AuthenticationGuard],
        loadChildren: './purchases/purchases.module#PurchasesModule',
      },
      {
        path: 'archives',
        canLoad: [AuthenticationGuard],
        loadChildren: './user-archive/user-archive.module#UserArchiveModule',
      },
      {
        path: 'confirmation',
        canLoad: [AuthenticationGuard],
        loadChildren: './confirmation/confirmation.module#ConfirmationModule',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SidenavRoutingModule {
}
