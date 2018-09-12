import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SearchComponent} from "./search.component";
import {AuthenticationGuard} from '../../app-routing/guards/authentication.guard';

const routes: Routes = [
  {
    path: 'search',
    component: SearchComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'user',
        loadChildren: './user/user.module#UserModule'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule {
}
