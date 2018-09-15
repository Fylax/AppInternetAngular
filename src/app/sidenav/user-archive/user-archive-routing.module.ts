import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserArchiveComponent} from "./user-archive.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: UserArchiveComponent,
    outlet: 'content'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserArchiveRoutingModule {
}
