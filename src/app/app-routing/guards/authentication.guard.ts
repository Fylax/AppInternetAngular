import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {Role, UserTokenService} from '../../services/user.service';
import {LoginService} from "../../services/login.service";
import {catchError, first, map} from "rxjs/operators";
import {Observable, BehaviorSubject, Subject} from "rxjs";
import {UrlService} from "../../services/url.service";


@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  private loggedEvent_ = new BehaviorSubject<boolean>(true);
  private tokenEvent_ = new Subject();

  constructor(private user: UserTokenService,
              private login: LoginService,
              private router: Router) {
    this.loggedEvent_.subscribe((logged) => {
      if (!logged) {
        this.router.navigate(['login']);
      }
    });
    this.tokenEvent_.subscribe(() => {
      this.router.navigate(['login', {session: 'expired'}]);
    });
  }

  canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.user.isLogged) {
      const token = this.user.refreshToken;
      if (token !== null) {
        if (this.user.isRefreshTokenExpired) {
          this.tokenEvent_.next();
          return false;
        }
        return this.login.refresh(token).pipe(
            map((resp) => {
              this.user.setTokens(resp.access_token, resp.refresh_token);
              this.loggedEvent_.next(true);
              return true;
            }),
            catchError(() => {
              this.loggedEvent_.next(false);
              return new BehaviorSubject<boolean>(false).asObservable();
            }),
            first());
      } else {
        this.loggedEvent_.next(false);
        return false;
      }
    }
    this.loggedEvent_.next(true);
    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  private event_ = new BehaviorSubject<boolean>(false);

  constructor(private user: UserTokenService,
              private login: LoginService,
              router: Router,
              url: UrlService) {
    this.event_.subscribe((logged) => {
      if (logged) {
        if (url.hasOnlyOauth) {
          url.refresh();
        }
        if (this.user.roles.includes(Role.ADMIN)) {
          router.navigate(['admin']);
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
        if (this.user.isRefreshTokenExpired) {
          return true;
        }
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
