import {CanLoad, Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {Role, UserService} from '../../services/user.service';
import {LoginService} from "../../login/login.service";
import {catchError, first, map} from "rxjs/operators";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {UrlService} from "../../services/url.service";


@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanLoad {

  private loggedEvent_ = new BehaviorSubject<boolean>(true);
  private tokenEvent_ = new Subject();

  constructor(private user: UserService,
              private login: LoginService,
              private router: Router) {
    this.loggedEvent_.subscribe((logged) => {
      if (!logged) {
        this.router.navigateByUrl('login');
      }
    });
    this.tokenEvent_.subscribe(() => {
      this.router.navigateByUrl('login;session:expired');
    });
  }

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.user.isLogged) {
      const token = UserService.refreshToken;
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
export class LoginGuard implements CanLoad {

  private event_ = new BehaviorSubject<boolean>(false);

  constructor(private user: UserService,
              private login: LoginService,
              router: Router,
              url: UrlService) {
    this.event_.subscribe((logged) => {
      if (logged) {
        if (url.hasOnlyOauth) {
          url.refresh();
        }
        if (this.user.roles.includes(Role.USER)) {
          router.navigateByUrl('search');
        }
      }
    });
  }

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.user.isLogged) {
      const token = UserService.refreshToken;
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
