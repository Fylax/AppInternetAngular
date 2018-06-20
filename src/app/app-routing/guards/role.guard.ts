import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Role, UserTokenService} from "../../services/user.service";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private user: UserTokenService) {
  }

  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.user.hasRole(Role.ADMIN);
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(private user: UserTokenService) {
  }

  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.user.hasRole(Role.USER) || this.user.hasRole(Role.ADMIN);
  }
}

@Injectable({
  providedIn: 'root'
})
export class CustomerGuard implements CanActivate {

  constructor(private user: UserTokenService) {
  }

  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.user.hasRole(Role.CUSTOMER) || this.user.hasRole(Role.ADMIN);
  }
}