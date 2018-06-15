import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/internal/Observable";
import {Role, UserTokenService} from '../../services/user.service';
import {LoginService} from "../../services/login.service";
import {first, map, mergeMap} from "rxjs/operators";
import {e} from "@angular/core/src/render3";
import {forkJoin} from "rxjs/internal/observable/forkJoin";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private user: UserTokenService,
              private login: LoginService,
              private router: Router) {
  }

  canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return (new Observable<boolean>(observer => {
      if (!this.user.isLogged) {
        const token = this.user.refreshToken;
        if (token !== null) {
          this.login.refresh(token).pipe(first())
              .subscribe((resp) => {
                this.user.setTokens(resp.access_token, resp.refresh_token);
              });
        } else {
          observer.next(false);
          observer.complete();
          return;
        }
      }
      observer.next(true);
      observer.complete();
    })).pipe(
        map((logged) => {
          if (!logged) {
            this.router.navigate(['login']);
          }
            return logged;
        }),
        first()
    );
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private user: UserTokenService,
              private login: LoginService,
              private router: Router) {
  }

  canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return (new Observable<boolean>(observer => {
      if (!this.user.isLogged) {
        const token = this.user.refreshToken;
        if (token !== null) {
          this.login.refresh(token).pipe(first())
              .subscribe((resp) => {
                this.user.setTokens(resp.access_token, resp.refresh_token);
              });
        } else {
          observer.next(false);
          observer.complete();
          return;
        }
      }
      observer.next(true);
      observer.complete();
    })).pipe(
        map((logged) => {
          if (logged) {
            // TODO switch
            // this.router.navigate(['map', 'positions']);
              if (this.user.roles.includes(Role.ADMIN)) {
                  this.router.navigate(['map', 'positions', 'user']); // TODO change with '.../admin'
                  return true;
              } else if (this.user.roles.includes(Role.CUSTOMER)) {
                  this.router.navigate(['map', 'positions', 'customer']);
                  return true;
              } else if (this.user.roles.includes(Role.USER)) {
                  this.router.navigate(['map', 'positions', 'user']);
                  return true;
              }
          }
          return !logged;
        }),
        first()
    );
  }
}
/*
@Injectable({
    providedIn: 'root'
})
export class ProfileGuard implements CanActivate {

    constructor(private user: UserTokenService,
                private login: LoginService,
                private router: Router) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        return false;
    }
}
*/
