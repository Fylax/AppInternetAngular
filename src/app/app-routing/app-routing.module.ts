import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthenticationGuard, LoginGuard} from "./guards/authentication.guard";

const routes: Routes = [
  {
    path: 'login',
    loadChildren: '../login/login.module#LoginModule',
    canLoad: [LoginGuard]
  },
  {
    path: 'register',
    loadChildren: '../register/register.module#RegisterModule',
    canLoad: [LoginGuard]
  },
  {
    path: '',
    canLoad: [AuthenticationGuard],
    loadChildren: '../sidenav/sidenav.module#SidenavModule',
  },
  {path: 'error/:id', loadChildren: '../error/error.module#ErrorModule'},
  {path: '**', redirectTo: '/error/404'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
