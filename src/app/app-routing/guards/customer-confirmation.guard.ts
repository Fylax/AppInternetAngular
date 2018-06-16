import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {ShareMapInfoService} from '../../services/share-map-info.service';

@Injectable({
  providedIn: 'root'
})
export class

CustomerConfirmationGuard implements CanActivate {
  constructor(private customer: ShareMapInfoService, private router: Router) {
  }

  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): boolean {
    if (this.customer.customerRequest === undefined || this.customer.customerRequest.area === undefined) {
      this.router.navigate(['map', 'positions']);
      return false;
    }
    return true;
  }
}
