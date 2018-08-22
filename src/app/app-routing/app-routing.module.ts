import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MapComponent} from '../components/logged/map/map.component';
import {SidenavComponent} from '../components/logged/sidenav.component';
import {AuthenticationGuard} from './guards/authentication.guard';
import {PurchaseComponent} from '../components/logged/customer-purchase/purchase.component';
import {ErrorComponent} from '../components/error/error.component';
import {UserComponent} from '../components/logged/user/user.component';
import {PurchaseDetailsComponent} from '../components/logged/customer-purchase-details/purchase-details.component';
import {AdminGuard} from './guards/role.guard';
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
    path: '',
    component: SidenavComponent,
    canActivate: [AuthenticationGuard, UnreachableGuard],
    children: [
      {
        path: 'search',
        component: SearchComponent,
        children: [
          {
            path: 'user',
            component: UserComponent
          },
        ]
      },
      {
        path: 'purchases',
        component: PurchaseComponent,
        children: [
          {
            path: ':id',
            component: PurchaseDetailsComponent
          },
        ]
      },
      {
        path: 'user',
        component: UserArchiveComponent
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AdminGuard],
        children: [
          {
            path: 'user/:id/positions',
            component: MapComponent,
            children: [{
              path: '',
              component: UserComponent
            }]
          }]
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
