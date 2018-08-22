import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserArchiveComponent} from "./user-archive.component";

const routes: Routes = [
  {
    path: 'user',
    component: UserArchiveComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserArchiveRoutingModule {
}
