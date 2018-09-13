import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SidenavComponent} from "./sidenav.component";
import {AuthenticationGuard, LoginGuard} from "../app-routing/guards/authentication.guard";
import {UnreachableGuard} from "../app-routing/guards/unreachable.guard";

const routes: Routes = [
  {
    path: '',
    component: SidenavComponent,
    canActivate: [LoginGuard, AuthenticationGuard, UnreachableGuard],
    children: [
      {
        path: 'search',
        loadChildren: './search/search.module#SearchModule'
      },
      {
        path: 'purchases',
        loadChildren: './purchases/purchases.module#PurchasesModule'
      },
      {
        path: 'mypage',
        loadChildren: './user-archive/user-archive.module#UserArchiveModule'
      },
      {
        path: 'confirmation',
        loadChildren: './confirmation/confirmation.module#ConfirmationModule'
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
