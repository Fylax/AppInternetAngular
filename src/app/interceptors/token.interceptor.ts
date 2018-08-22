import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserService} from "../services/user.service";
import {environment} from "../../environments/environment";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private user: UserService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = req.url.substring(environment.baseUrl.length);
    let headers = req.headers.set('Accept', 'application/json');
    if (url === 'oauth/token' || url === 'oauth/register' ||
        (url === '' && !this.user.isLogged)) {
      return next.handle(req.clone({
            headers: headers
          })
      );
    }

    headers = headers.set('Authorization', `Bearer ${this.user.accessToken}`);
    if (req.method.toUpperCase() === 'POST') {
      headers = headers.set('Content-Type', 'application/json');
    }

    return next.handle(req.clone({
          headers: headers
        })
    );
  }
}
