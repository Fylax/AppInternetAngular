import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Role, UserService} from "../../services/user.service";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private user: UserService) {
  }

  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.user.hasRole(Role.ADMIN);
  }
}
