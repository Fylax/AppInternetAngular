import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MapComponent} from '../components/logged/map/map.component';
import {CustomerComponent} from '../components/logged/map/customer/customer.component';
import {CustomerConfirmationComponent} from '../components/logged/map/customer-confirmation/customer-confirmation.component';
import {CustomerConfirmationGuard} from './guards/customer-confirmation.guard';
import {LoginComponent} from "../components/login/login.component";
import {LoggedComponent} from "../components/logged/logged.component";
import {AuthenticationGuard, LoginGuard} from "./guards/authentication.guard";
import {CustomerPurchaseComponent} from '../components/logged/map/customer-purchase/customer-purchase.component';
import {ErrorComponent} from '../components/error/error.component';
import {UserComponent} from '../components/logged/map/user/user.component';
import {CustomerPurchaseDetailsComponent} from '../components/logged/map/customer-purchase-details/customer-purchase-details.component';
import {AdminGuard, UserGuard, CustomerGuard} from "./guards/role.guard";
import {UnreachableGuard} from "./guards/unreachable.guard";
import {AdminComponent} from '../components/logged/map/admin/admin.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'map',
    component: LoggedComponent,
    canActivate: [AuthenticationGuard, UnreachableGuard],
    children: [
      {
        path: 'positions',
        component: MapComponent,
        canActivate: [UnreachableGuard],
        children: [
          {
            path: 'customer',
            component: CustomerComponent,
            canActivate: [CustomerGuard],
          },
          {
            path: 'customer/confirmation',
            component: CustomerConfirmationComponent,
            canActivate: [CustomerConfirmationGuard]
          },
          {
            path: 'user',
            component: UserComponent,
            canActivate: [UserGuard]
            /*children: [
                {
                    path: 'send',
                    canActivate: [UserConfirmationGuard],
                    component: UserConfirmationComponent
                }
            ]*/
          }
        ]
      }]
  }
  ,
  {
    path: 'purchases',
    component: LoggedComponent,
    canActivate: [AuthenticationGuard, CustomerGuard],
    children: [{
      path: '',
      component: CustomerPurchaseComponent,
    }, {
      path: ':id',
      component: CustomerPurchaseDetailsComponent
    }]
  },
  {
    path: 'admin',
    component: LoggedComponent,
    canActivate: [AuthenticationGuard, AdminGuard],
    children: [{
      path: '',
      component: AdminComponent
    }]
  },
  {path: 'error/:id', component: ErrorComponent},
  {path: '**', redirectTo: '/error/404'}
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
