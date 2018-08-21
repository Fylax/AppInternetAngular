import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {ShareMapInfoService} from '../../services/share-map-info.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerConfirmationGuard implements CanActivate {
  constructor(private customer: ShareMapInfoService) {
  }

  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): boolean {
    return this.customer.userSearchRequest !== undefined && this.customer.userSearchRequest.area !== undefined;
  }
}
