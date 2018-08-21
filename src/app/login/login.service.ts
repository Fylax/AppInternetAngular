import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {UrlService} from '../services/url.service';
import {RestResource} from "../model/rest-resource.enum";

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
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.baseService.post(RestResource.OAuth, body.toString(), headers, true);
  }

  /**
   * Method for refreshing the access token by means of refresh token.
   * @param refreshToken Required refresh token.
   * @returns Observable containing both access token and refresh token
   * to be stored in application local memory.
   */
  public refresh(refreshToken: string): Observable<{ access_token: string, refresh_token: string }> {
    const body = new HttpParams()
        .set('grant_type', 'refresh_token')
        .set('client_id', environment.clientId)
        .set('client_secret', environment.clientSecret)
        .set('refresh_token', refreshToken);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.baseService.post(RestResource.OAuth, body.toString(), headers, true);
  }
}
