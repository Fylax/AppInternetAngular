import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MapComponent} from '../components/map/map.component';
import {CustomerbuyComponent} from '../components/map/customerbuy/customerbuy.component';
import {CustomerPurchaseComponent} from '../components/map/customer-purchase/customer-purchase.component';

const routes: Routes = [
  {path: 'positions', component: MapComponent,
  children: [
    {path: '', component: CustomerbuyComponent},
    {path: 'confirmation', component: CustomerPurchaseComponent}
  ]},
  {path: '', redirectTo: 'positions', pathMatch: 'full'}
]


@NgModule({
  imports: [
    RouterModule.forRoot(routes, {enableTracing: true})
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
