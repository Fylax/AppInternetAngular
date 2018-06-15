import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/internal/Observable";
import {Role, UserTokenService} from '../../services/user.service';
import {LoginService} from "../../services/login.service";
import {catchError, first, map, mergeMap} from "rxjs/operators";
import {e} from "@angular/core/src/render3";
import {forkJoin} from "rxjs/internal/observable/forkJoin";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  private event_ = new BehaviorSubject<boolean>(this.user.isLogged);

  constructor(private user: UserTokenService,
              private login: LoginService,
              private router: Router) {
    this.event_.subscribe((logged) => {
      if (!logged) {
        this.router.navigate(['login']);
      }
    });
  }

  canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.user.isLogged) {
      const token = this.user.refreshToken;
      if (token !== null) {
        return this.login.refresh(token).pipe(
            map((resp) => {
              this.user.setTokens(resp.access_token, resp.refresh_token);
              this.event_.next(true);
              return true;
            }),
            catchError(() => {
              this.event_.next(false);
              return new BehaviorSubject<boolean>(false).asObservable();
            }),
            first());
      } else {
        this.event_.next(false);
        return false;
      }
    }
    this.event_.next(true);
    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  private event_ = new BehaviorSubject<boolean>(this.user.isLogged);

  constructor(private user: UserTokenService,
              private login: LoginService,
              router: Router) {
    this.event_.subscribe((logged) => {
      if (logged) {
        if (this.user.roles.includes(Role.ADMIN)) {
          router.navigate(['map', 'positions', 'user']); // TODO change with '.../admin'
        } else if (this.user.roles.includes(Role.CUSTOMER)) {
          router.navigate(['map', 'positions', 'customer']);
        } else if (this.user.roles.includes(Role.USER)) {
          router.navigate(['map', 'positions', 'user']);
        }
      }
    });
  }

  canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.user.isLogged) {
      const token = this.user.refreshToken;
      if (token !== null) {
        return this.login.refresh(token).pipe(
            map((resp) => {
              this.user.setTokens(resp.access_token, resp.refresh_token);
              this.event_.next(true);
              return false;
            }),
            catchError(() => {
              this.event_.next(false);
              return new BehaviorSubject<boolean>(true).asObservable();
            }),
            first());
      } else {
        this.event_.next(false);
        return true;
      }
    }
    this.event_.next(true);
    return false;
  }
}
