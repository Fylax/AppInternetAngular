import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserTokenService} from "../services/user.service";
import {environment} from "../../environments/environment";
import {LoginService} from "../services/login.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private user: UserTokenService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = req.url.substring(environment.baseUrl.length);
    if (url === '' && this.user.accessToken === null) {
      return next.handle(req);
    }
    if (url === 'oauth/token') {
      return next.handle(req);
    }

    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.user.accessToken}`
    });

    if (req.method.toUpperCase() === 'POST') {
      headers = headers.set('Content-Type', 'application/json');
    }

    const request = req.clone({
      headers: headers
    });
    return next.handle(request);
  }
}
