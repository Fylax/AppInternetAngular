import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/internal/Observable";
import {UserTokenService} from "../../services/user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private user: UserTokenService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.user.isLogged) {
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private user: UserTokenService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.user.isLogged) {
      return true;
    }
    // TODO switch
    this.router.navigate(['map', 'positions']);
    return false;
  }
}

