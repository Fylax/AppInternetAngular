import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
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
    loadChildren: '../sidenav/sidenav.module#SidenavModule'
  },
  {path: 'error/:id', loadChildren: '../error/error.module#ErrorModule'},
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
