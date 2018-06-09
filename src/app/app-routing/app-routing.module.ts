import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MapComponent} from '../components/logged/map/map.component';
import {CustomerbuyComponent} from '../components/logged/map/customerbuy/customerbuy.component';
import {CustomerPurchaseComponent} from '../components/logged/map/customer-purchase/customer-purchase.component';
import {CustomerConfirmationGuard} from './guards/customer-confirmation.guard';
import {LoginComponent} from "../components/login/login.component";
import {LoggedComponent} from "../components/logged/logged.component";
import {AuthenticationGuard, LoginGuard} from "./guards/authentication.guard";
import {NotFoundComponent} from "../components/notfound/not-found.component";

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'map',
    component: LoggedComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'positions',
        component: MapComponent,
        children: [
          {
            path: '',
            component: CustomerbuyComponent
          },
          {
            path: 'confirmation',
            canActivate: [CustomerConfirmationGuard],
            component: CustomerPurchaseComponent
          }
        ]
      }]
  },
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: '**', component: NotFoundComponent }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  // providers: [CustomerConfirmationGuard, ShareMapInfoService],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
