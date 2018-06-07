import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MapComponent} from '../components/logged/map/map.component';
import {CustomerbuyComponent} from '../components/logged/map/customerbuy/customerbuy.component';
import {CustomerPurchaseComponent} from '../components/logged/map/customer-purchase/customer-purchase.component';
import {AuthGuardGuard} from '../auth-guard.guard';
import {ShareMapInfoService} from '../services/share-map-info.service';
import {LoginComponent} from "../components/login/login.component";

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
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
        canActivate: [AuthGuardGuard],
        component: CustomerPurchaseComponent
      }
    ]
  },
  {path: '', redirectTo: 'login', pathMatch: 'full'}
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, {enableTracing: true})
  ],
  providers: [AuthGuardGuard, ShareMapInfoService],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
