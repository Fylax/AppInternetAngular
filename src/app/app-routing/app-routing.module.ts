import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MapComponent} from '../components/logged/map/map.component';
import {CustomerComponent} from '../components/logged/map/customer/customer.component';
import {CustomerConfirmationComponent} from '../components/logged/map/customer-confirmation/customer-confirmation.component';
import {CustomerConfirmationGuard} from './guards/customer-confirmation.guard';
import {LoginComponent} from "../components/login/login.component";
import {LoggedComponent} from "../components/logged/logged.component";
import {AuthenticationGuard, LoginGuard} from "./guards/authentication.guard";
import {ErrorComponent} from "../components/error/error.component";

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
            component: CustomerComponent
          },
          {
            path: 'confirmation',
            canActivate: [CustomerConfirmationGuard],
            component: CustomerConfirmationComponent
          }
        ]
      }]
  },
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'error/:id', component: ErrorComponent},
  {path: '**', redirectTo: '/error/404' }
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
