import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MapComponent} from '../components/logged/map/map.component';
import {CustomerConfirmationComponent} from '../components/logged/customer-confirmation/customer-confirmation.component';
import {CustomerConfirmationGuard} from './guards/customer-confirmation.guard';
import {LoggedComponent} from '../components/logged/logged.component';
import {AuthenticationGuard} from './guards/authentication.guard';
import {CustomerPurchaseComponent} from '../components/logged/customer-purchase/customer-purchase.component';
import {ErrorComponent} from '../components/error/error.component';
import {UserComponent} from '../components/logged/user/user.component';
import {CustomerPurchaseDetailsComponent} from '../components/logged/customer-purchase-details/customer-purchase-details.component';
import {AdminGuard, UserGuard, CustomerGuard} from './guards/role.guard';
import {UnreachableGuard} from './guards/unreachable.guard';
import {AdminComponent} from '../components/logged/admin/admin.component';
import {SearchComponent} from '../components/logged/search/search.component';
import {UserArchiveComponent} from '../components/logged/user-archive/user-archive.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: 'login',
    loadChildren: '../login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: '../register/register.module#RegisterModule'
  },
  {
    path: 'map',
    component: LoggedComponent,
    canActivate: [AuthenticationGuard, UnreachableGuard],
    children: [
      {
        path: 'positions',
        component: SearchComponent,
        canActivate: [UnreachableGuard],
        children: [
          {
            path: 'customer',
            component: SearchComponent,
            canActivate: [UserGuard],
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
          }
        ]
      }]
  },
  {
    path: 'purchases',
    component: LoggedComponent,
    canActivate: [AuthenticationGuard, CustomerGuard],
    children: [{
      path: '',
      component: CustomerPurchaseComponent,
    },
      {
        path: 'customer/purchases/:id',
        component: CustomerPurchaseDetailsComponent
      }]
  },
  {
    path: 'admin',
    component: LoggedComponent,
    canActivate: [AuthenticationGuard, AdminGuard],
    children: [
      {
        path: '',
        component: AdminComponent,
      },
      {
        path: 'customer/:id/purchases',
        component: CustomerPurchaseComponent
      },
      {
        path: 'customer/:id/purchases/:pid',
        component: CustomerPurchaseDetailsComponent
      },
      {
        path: 'user/:id/positions',
        component: MapComponent,
        children: [{
          path: '',
          component: UserComponent
        }]
      }
    ]
  },
  {
    path: 'user',
    component: LoggedComponent,
    canActivate: [AuthenticationGuard, UserGuard],
    children: [{
      path: '',
      component: UserArchiveComponent
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
