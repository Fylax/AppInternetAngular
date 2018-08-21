import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {from, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Urls, UrlService} from '../services/url.service';
import {switchMap} from 'rxjs/operators';

@Injectable()
export class LoginService {

  constructor(private http: HttpClient, private baseService: UrlService) { }

  /**
   * Method for trying user login.
   * @param username Username.
   * @param password Clear-text user password.
   * @returns Observable containing both access token and refresh token
   * to be stored in application local memory.
   */
  public login(username: string, password: string): Observable<{ access_token: string, refresh_token: string }> {
    const body = new HttpParams()
        .set('grant_type', 'password')
        .set('username', username)
        .set('password', password)
        .set('client_id', environment.clientId)
        .set('client_secret', environment.clientSecret);
    return this.request(body.toString());
  }

  public refresh(refreshToken: string): Observable<{ access_token: string, refresh_token: string }> {
    const body = new HttpParams()
        .set('grant_type', 'refresh_token')
        .set('client_id', environment.clientId)
        .set('client_secret', environment.clientSecret)
        .set('refresh_token', refreshToken);
    return this.request(body.toString());
  }

  private request(body: string) {
    return from(this.baseService.promise)
        .pipe(
            switchMap((urlList: Urls) => {
              return this.http.post<{ access_token: string, refresh_token: string }>(
                  urlList.oauth.href,
                  body, {
                    headers: new HttpHeaders({
                      'Content-Type': 'application/x-www-form-urlencoded'
                    }),
                    responseType: 'json',
                    withCredentials: true
                  });
            })
        );
  }
}
