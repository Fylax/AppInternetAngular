import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {ShareMapInfoService} from './services/share-map-info.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
  constructor(private customer: ShareMapInfoService, private router: Router) {
  }

  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): boolean {
    if (this.customer.customerRequest === null || this.customer.customerRequest === undefined) {
      this.router.navigate(['/positions']);
    }
    return true;
  }
}
