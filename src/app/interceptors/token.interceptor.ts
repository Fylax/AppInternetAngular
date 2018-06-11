import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserTokenService} from "../services/user.service";
import {environment} from "../../environments/environment";
import {LoginService} from "../services/login.service";
import {first, map, mergeMap, tap} from "rxjs/operators";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private user: UserTokenService,
              private login: LoginService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = req.url.substring(environment.baseUrl.length);
    if (url === 'oauth/token') {
      return next.handle(req);
    }

    let headers = new HttpHeaders({
      'Accept': 'application/json'
    });
    if (req.method.toUpperCase() === 'POST') {
      headers = headers.set('Content-Type', 'application/json');
    }

    if (this.user.isTokenExpired) {
      return this.login.refresh(this.user.refreshToken)
          .pipe(
              mergeMap((resp) => {
                this.user.setTokens(resp.access_token, resp.refresh_token);

                headers = headers.set('Authorization', `Bearer ${this.user.accessToken}`);
                const request = req.clone({
                  headers: headers
                });
                return next.handle(request);
              }),
              first()
          );
    } else {
      headers = headers.set('Authorization', `Bearer ${this.user.accessToken}`);
      const request = req.clone({
        headers: headers
      });
      return next.handle(request);
    }
  }
}
