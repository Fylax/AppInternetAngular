import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserArchiveComponent} from "./user-archive.component";
import {AuthenticationGuard} from "../../app-routing/guards/authentication.guard";

const routes: Routes = [
  {
    path: 'u',
    component: UserArchiveComponent,
    canActivate: [AuthenticationGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserArchiveRoutingModule {
}
