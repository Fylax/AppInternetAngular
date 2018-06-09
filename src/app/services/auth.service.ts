import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import moment = require('moment');

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private oauthUrl = 'http://localhost:8080/oauth/token';

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    const basicAuth = "Basic " + btoa("client:secret");
    const httpOptions = {
      headers: new HttpHeaders({ 'Authorization': basicAuth })
    };
    return this.http.post<{access_token: string, refresh_token: string}>(this.oauthUrl, {email, password}, httpOptions)
        .pipe(
            tap(
                event => {
                  if (event instanceof HttpResponse) {

                  }
                }
            )
        );

  }

  private setSession(authResult) {
    const expiresAt = moment().add(authResult.expiresIn,'second');

    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
  }
}
